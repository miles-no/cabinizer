using System;
using System.Collections.Generic;

namespace Cabinizer.Data
{
    public class Item
    {
        public Item()
        {
            Raffles = new List<Raffle>();
        }

        public Guid Id { get; set; }

        public string Name { get; set; } = null!;

        public string OwnerId { get; set; } = null!;

        public User Owner { get; set; } = null!;

        public ICollection<Raffle> Raffles { get; }
    }
}