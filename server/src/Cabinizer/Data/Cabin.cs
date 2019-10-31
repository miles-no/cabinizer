using System;
using System.Collections.Generic;

namespace Cabinizer.Data
{
    public class Cabin
    {
        public Cabin()
        {
            Periods = new List<Period>();
        }

        public Guid Id { get; set; }

        public string Name { get; set; } = null!;

        public string AdminUserId { get; set; } = null!;

        public User AdminUser { get; set; } = null!;

        public string OrganizationUnitPath { get; set; } = null!;

        public OrganizationUnit OrganizationUnit { get; set; } = null!;

        public ICollection<Period> Periods { get; }
    }
}