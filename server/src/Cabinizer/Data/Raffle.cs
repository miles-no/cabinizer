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

        public Guid CabinId { get; set; }

        public Cabin Cabin { get; set; } = null!;

        public ICollection<Period> Periods { get; }
    }
}