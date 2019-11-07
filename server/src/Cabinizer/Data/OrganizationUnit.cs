using System.Collections.Generic;

namespace Cabinizer.Data
{
    public class OrganizationUnit : Entity<string>
    {
        public OrganizationUnit()
        {
            Children = new List<OrganizationUnit>();
        }

        public string Name { get; set; } = null!;

        public string? ParentId { get; set; }

        public ICollection<OrganizationUnit> Children { get; }
    }
}
