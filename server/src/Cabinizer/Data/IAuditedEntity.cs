using NodaTime;

namespace Cabinizer.Data
{
    public interface IAuditedEntity
    {
        Instant CreatedAt { get; set; }

        Instant UpdatedAt { get; set; }

        string CreatedBy { get; set; }

        string UpdatedBy { get; set; }
    }
}
