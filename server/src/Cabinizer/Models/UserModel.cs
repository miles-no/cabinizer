namespace Cabinizer.Models
{
    public class UserModel
    {
        public string Id { get; set; } = null!;

        public string GivenName { get; set; } = null!;

        public string FamilyName { get; set; } = null!;

        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;

        public string? CloudinaryPublicId { get; set; }

        public string? PictureUrl { get; set; }

        public string OrganizationUnitPath { get; set; } = null!;
    }
}
