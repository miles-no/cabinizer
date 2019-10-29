using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using NodaTime;

namespace Cabinizer
{
    public class CabinizerContext : DbContext
    {
        public CabinizerContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Item> Items { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.UseSnakeCaseNamingConvention();
        }
    }

    public class Item
    {
        public Item()
        {
            Periods = new List<Period>();
        }

        public Guid Id { get; set; }

        public string Name { get; set; }

        public ICollection<Period> Periods { get; }
    }

    public class Period
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public Guid ItemId { get; set; }

        public Item Item { get; set; }

        public LocalDateTime StartTime { get; set; }

        public LocalDateTime EndTime { get; set; }
    }

    public class Raffle
    {
        public Raffle()
        {
            Periods = new List<Period>();
        }

        public Guid Id { get; set; }

        public string Name { get; set; }

        public ICollection<Period> Periods { get; }
    }
}
