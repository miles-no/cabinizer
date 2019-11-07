using System;
using System.Collections.Generic;

namespace Cabinizer.Data
{
    public class Raffle : Entity<Guid>
    {
        public Raffle()
        {
            Periods = new List<Period>();
        }

        public string Name { get; set; } = null!;

        public Guid CabinId { get; set; }

        public Cabin Cabin { get; set; } = null!;

        public ICollection<Period> Periods { get; }
    }
}