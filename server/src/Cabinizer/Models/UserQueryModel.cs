namespace Cabinizer.Models
{
    public class UserQueryModel : PagedQueryModel
    {
        public string? OrgUnitPath { get; set; } = null!;
    }
}
