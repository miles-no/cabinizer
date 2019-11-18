using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cabinizer.Data
{
    public class User : Entity<string>
    {
        public User()
        {
            Items = new List<Item>();
        }

        public string GivenName { get; set; } = null!;

        public string FamilyName { get; set; } = null!;

        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;

        public string? CloudinaryPublicId { get; set; }

        public string OrganizationUnitPath { get; set; } = null!;

        public OrganizationUnit OrganizationUnit { get; set; } = null!;

        public ICollection<Item> Items { get; }

        public class Configuration : Configuration<User>
        {
            protected override void Configure(EntityTypeBuilder<User> builder)
            {
                builder.HasIndex(x => x.Email).IsUnique();

                builder.Property(x => x.Email).HasColumnType("citext");

                builder.HasOne(x => x.OrganizationUnit)
                    .WithMany()
                    .HasForeignKey(x => x.OrganizationUnitPath)
                    .IsRequired();
            }
        }
    }
}