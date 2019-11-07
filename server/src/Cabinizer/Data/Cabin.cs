using System;
using System.Collections.Generic;

namespace Cabinizer.Data
{
    public class Cabin : Entity<Guid>
    {
        public Cabin()
        {
            Periods = new List<Period>();
        }

        public string Name { get; set; } = null!;

        public string AdminUserId { get; set; } = null!;

        public User AdminUser { get; set; } = null!;

        public string OrganizationUnitId { get; set; } = null!;

        public OrganizationUnit OrganizationUnit { get; set; } = null!;

        public ICollection<Period> Periods { get; }
    }
}