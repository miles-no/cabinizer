using Microsoft.EntityFrameworkCore;

namespace Cabinizer.Data
{
    public class CabinizerContext : DbContext
    {
        public CabinizerContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;

        public DbSet<Cabin> Cabins { get; set; } = null!;

        public DbSet<OrganizationUnit> OrganizationUnits { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.HasPostgresExtension("citext");

            builder.Entity<User>().HasIndex(x => x.Email).IsUnique();
            builder.Entity<User>().Property(x => x.Email).HasColumnType("citext");

            builder.Entity<OrganizationUnit>()
                .HasMany(x => x.Children)
                .WithOne()
                .HasForeignKey(x => x.ParentId)
                .IsRequired(false);

            builder.UseSnakeCaseNamingConvention();
        }
    }
}
