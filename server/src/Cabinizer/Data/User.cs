using System.Collections.Generic;

namespace Cabinizer.Data
{
    public class User
    {
        public User()
        {
            Items = new List<Item>();
        }

        public string Id { get; set; } = null!;

        public string GivenName { get; set; } = null!;

        public string FamilyName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public bool IsEmailVerified { get; set; }

        public string PhoneNumber { get; set; } = null!;

        public bool IsPhoneNumberVerified { get; set; }

        public string PictureUrl { get; set; } = null!;

        public ICollection<Item> Items { get; }
    }
}