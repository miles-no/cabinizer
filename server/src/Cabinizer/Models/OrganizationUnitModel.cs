namespace Cabinizer.Models
{
    public class OrganizationUnitModel
    {
        public string Path { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string? ParentPath { get; set; }
    }
}
