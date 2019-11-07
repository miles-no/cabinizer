namespace Cabinizer.Models
{
    public class UserQueryModel : PagedQueryModel
    {
        public string? OrganizationUnitPath { get; set; } = null!;
    }
}
