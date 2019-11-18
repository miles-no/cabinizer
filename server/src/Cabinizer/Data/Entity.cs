using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NodaTime;

namespace Cabinizer.Data
{
    public abstract class Entity<TKey> : IAuditedEntity, IEquatable<Entity<TKey>>
        where TKey : notnull
    {
        public TKey Id { get; set; } = default!;

        public Instant CreatedAt { get; set; }

        public Instant UpdatedAt { get; set; }

        public string CreatedBy { get; set; } = null!;

        public string UpdatedBy { get; set; } = null!;

        public bool Equals(Entity<TKey> other)
        {
            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return EqualityComparer<TKey>.Default.Equals(Id, other.Id);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj))
            {
                return false;
            }

            if (ReferenceEquals(this, obj))
            {
                return true;
            }

            if (obj.GetType() != this.GetType())
            {
                return false;
            }

            return Equals((Entity<TKey>) obj);
        }

        public override int GetHashCode()
        {
            return EqualityComparer<TKey>.Default.GetHashCode(Id);
        }

        public static bool operator ==(Entity<TKey> left, Entity<TKey> right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(Entity<TKey> left, Entity<TKey> right)
        {
            return !Equals(left, right);
        }

        public abstract class Configuration<TEntity> : IEntityTypeConfiguration<TEntity>
            where TEntity : Entity<TKey>
        {
            void IEntityTypeConfiguration<TEntity>.Configure(EntityTypeBuilder<TEntity> builder)
            {
                builder.HasKey(x => x.Id);

                builder.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(x => x.CreatedBy)
                    .IsRequired();

                builder.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(x => x.UpdatedBy)
                    .IsRequired();

                Configure(builder);
            }

            protected abstract void Configure(EntityTypeBuilder<TEntity> builder);
        }
    }
}
