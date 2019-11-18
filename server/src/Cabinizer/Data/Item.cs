using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cabinizer.Data
{
    public class Item : Entity<Guid>
    {
        public Item()
        {
            Bookings = new List<Booking>();
        }

        public string Name { get; set; } = null!;

        public string AdminUserId { get; set; } = null!;

        public User AdminUser { get; set; } = null!;

        public string OrganizationUnitPath { get; set; } = null!;

        public OrganizationUnit OrganizationUnit { get; set; } = null!;

        public ICollection<Booking> Bookings { get; }

        public class Configuration : Configuration<Item>
        {
            protected override void Configure(EntityTypeBuilder<Item> builder)
            {
                builder.HasOne(x => x.AdminUser)
                    .WithMany()
                    .HasForeignKey(x => x.AdminUserId)
                    .IsRequired();

                builder.HasOne(x => x.OrganizationUnit)
                    .WithMany()
                    .HasForeignKey(x => x.OrganizationUnitPath)
                    .IsRequired();
            }
        }
    }
}