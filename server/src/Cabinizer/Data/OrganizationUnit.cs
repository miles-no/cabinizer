using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cabinizer.Data
{
    public class OrganizationUnit
    {
        public OrganizationUnit()
        {
            Children = new List<OrganizationUnit>();
        }

        public string Path { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string? ParentPath { get; set; }

        public ICollection<OrganizationUnit> Children { get; }

        public class Configuration : IEntityTypeConfiguration<OrganizationUnit>
        {
            public void Configure(EntityTypeBuilder<OrganizationUnit> builder)
            {
                builder.HasKey(x => x.Path);

                builder.HasMany(x => x.Children)
                    .WithOne()
                    .HasForeignKey(x => x.ParentPath)
                    .IsRequired(false);
            }
        }
    }
}
