namespace Cabinizer.Models
{
    public class UserQueryModel : PagedQueryModel
    {
        public string? OrganizationUnitId { get; set; } = null!;
    }
}
