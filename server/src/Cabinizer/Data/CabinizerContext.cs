using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NodaTime;

namespace Cabinizer.Data
{
    public class CabinizerContext : DbContext
    {
        public CabinizerContext(DbContextOptions options, IClock clock, IHttpContextAccessor httpContextAccessor) : base(options)
        {
            Clock = clock;
            HttpContextAccessor = httpContextAccessor;
        }

        public CabinizerPrincipal CurrentUser { get; set; }

        public DbSet<User> Users { get; set; } = null!;

        public DbSet<Item> Items { get; set; } = null!;

        public DbSet<OrganizationUnit> OrganizationUnits { get; set; } = null!;

        private IClock Clock { get; }

        private IHttpContextAccessor HttpContextAccessor { get; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.HasPostgresExtension("citext");

            builder.ApplyConfiguration(new User.Configuration());
            builder.ApplyConfiguration(new Booking.Configuration());
            builder.ApplyConfiguration(new Raffle.Configuration());
            builder.ApplyConfiguration(new Item.Configuration());
            builder.ApplyConfiguration(new OrganizationUnit.Configuration());

            builder.UseSnakeCaseNamingConvention();
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            OnBeforeSaving();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            OnBeforeSaving();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void OnBeforeSaving()
        {
            var currentUser = GetCurrentUser(CurrentUser, HttpContextAccessor);

            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Entity is IAuditedEntity audited)
                {
                    var currentInstant = Clock.GetCurrentInstant();

                    switch (entry.State)
                    {
                        case EntityState.Modified:
                            audited.UpdatedAt = currentInstant;
                            audited.UpdatedBy = currentUser.Id;
                            break;
                        case EntityState.Added:
                            audited.CreatedAt = audited.UpdatedAt = currentInstant;
                            audited.CreatedBy = audited.UpdatedBy = currentUser.Id;
                            break;
                    }
                }
            }
        }

        private static CabinizerPrincipal GetCurrentUser(CabinizerPrincipal? currentUser, IHttpContextAccessor httpContextAccessor)
        {
            if (currentUser is null)
            {
                var httpContext = httpContextAccessor.HttpContext;

                if (httpContext is null)
                {
                    throw new InvalidOperationException("Current user must be specified outside HTTP requests.");
                }

                return new CabinizerPrincipal(httpContext.User);
            }

            return currentUser;
        }
    }
}
