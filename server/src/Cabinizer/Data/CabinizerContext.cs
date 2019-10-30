using Microsoft.EntityFrameworkCore;

namespace Cabinizer.Data
{
    public class CabinizerContext : DbContext
    {
        public CabinizerContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;

        public DbSet<Item> Items { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.HasPostgresExtension("citext");

            builder.UseSnakeCaseNamingConvention();

            builder.Entity<User>().HasIndex(x => x.Email).IsUnique();
            builder.Entity<User>().Property(x => x.Email).HasColumnType("citext");
        }
    }
}
