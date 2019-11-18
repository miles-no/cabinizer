using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cabinizer.Data
{
    public class Raffle : Entity<Guid>
    {
        public Raffle()
        {
            Bookings = new List<Booking>();
        }

        public string Name { get; set; } = null!;

        public Guid ItemId { get; set; }

        public Item Item { get; set; } = null!;

        public ICollection<Booking> Bookings { get; }

        public class Configuration : Configuration<Raffle>
        {
            protected override void Configure(EntityTypeBuilder<Raffle> builder)
            {
                builder.HasOne(x => x.Item)
                    .WithMany()
                    .HasForeignKey(x => x.ItemId)
                    .IsRequired();
            }
        }
    }
}