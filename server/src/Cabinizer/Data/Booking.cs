using System;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NodaTime;

namespace Cabinizer.Data
{
    public class Booking : Entity<Guid>
    {
        public string Name { get; set; } = null!;

        public Guid ItemId { get; set; }

        public Item Item { get; set; } = null!;

        public Guid RaffleId { get; set; }

        public Raffle Raffle { get; set; }

        public LocalDateTime StartTime { get; set; }

        public LocalDateTime EndTime { get; set; }

        public class Configuration : Configuration<Booking>
        {
            protected override void Configure(EntityTypeBuilder<Booking> builder)
            {
                builder.HasOne(x => x.Item)
                    .WithMany(x => x.Bookings)
                    .HasForeignKey(x => x.ItemId)
                    .IsRequired();

                builder.HasOne(x => x.Raffle)
                    .WithMany(x => x.Bookings)
                    .HasForeignKey(x => x.RaffleId)
                    .IsRequired();
            }
        }
    }
}