using System;
using System.Collections.Generic;

namespace Cabinizer.Data
{
    public class Raffle
    {
        public Raffle()
        {
            Periods = new List<Period>();
        }

        public Guid Id { get; set; }

        public string Name { get; set; } = null!;

        public Guid ItemId { get; set; }

        public Item Item { get; set; } = null!;

        public ICollection<Period> Periods { get; }
    }
}