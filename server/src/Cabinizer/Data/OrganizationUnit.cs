using System.Collections.Generic;

namespace Cabinizer.Data
{
    public class OrganizationUnit
    {
        public OrganizationUnit()
        {
            Children = new List<OrganizationUnit>();
        }

        public string Path { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string? ParentPath { get; set; }

        public ICollection<OrganizationUnit> Children { get; }
    }
}
