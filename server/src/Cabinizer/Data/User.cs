using System.Collections.Generic;

namespace Cabinizer.Data
{
    public class User
    {
        public User()
        {
            Items = new List<Cabin>();
        }

        public string Id { get; set; } = null!;

        public string GivenName { get; set; } = null!;

        public string FamilyName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;

        public string? PictureUrl { get; set; }

        public string OrganizationUnitPath { get; set; } = null!;

        public OrganizationUnit OrganizationUnit { get; set; } = null!;

        public ICollection<Cabin> Items { get; }
    }
}