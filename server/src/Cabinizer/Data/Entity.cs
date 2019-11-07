namespace Cabinizer.Data
{
    public abstract class Entity<TKey>
        where TKey : notnull
    {
        public TKey Id { get; set; } = default!;
    }
}
