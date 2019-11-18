using System.Linq;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Npgsql.NameTranslation;

namespace Cabinizer
{
    public static class ModelBuilderExtensions
    {
        public static ModelBuilder UseSnakeCaseNamingConvention(this ModelBuilder modelBuilder)
        {
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                entity.SetTableName(NpgsqlSnakeCaseNameTranslator.ConvertToSnakeCase(entity.ClrType.Name));

                foreach (var property in entity.GetProperties())
                {
                    property.SetColumnName(NpgsqlSnakeCaseNameTranslator.ConvertToSnakeCase(property.GetColumnName()));
                }
            }

            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var key in entity.GetKeys())
                {
                    key.SetName(GetDefaultName(key));
                }

                foreach (var key in entity.GetForeignKeys())
                {
                    key.SetConstraintName(GetDefaultName(key));
                }

                foreach (var index in entity.GetIndexes())
                {
                    index.SetName(GetDefaultName(index));
                }
            }

            return modelBuilder;
        }

        private static string GetDefaultName(IMutableForeignKey key)
        {
            var baseName = new StringBuilder()
                .Append(key.DeclaringEntityType.GetTableName())
                .Append("_")
                .Append(key.PrincipalEntityType.GetTableName())
                .Append("_")
                .AppendJoin("_", key.Properties.Select(p => p.GetColumnName()))
                .Append("_fkey")
                .ToString();

            return Uniquifier.Truncate(baseName, key.DeclaringEntityType.Model.GetMaxIdentifierLength());
        }

        private static string GetDefaultName(IIndex index)
        {
            var baseName = new StringBuilder()
                .Append(index.DeclaringEntityType.GetTableName())
                .Append("_ix_")
                .AppendJoin("_", index.Properties.Select(p => p.GetColumnName()))
                .ToString();

            return Uniquifier.Truncate(baseName, index.DeclaringEntityType.Model.GetMaxIdentifierLength());
        }

        private static string GetDefaultName(IKey key)
        {
            var sharedTablePrincipalPrimaryKeyProperty = key.Properties[0].FindSharedTableRootPrimaryKeyProperty();

            if (sharedTablePrincipalPrimaryKeyProperty != null)
            {
                return sharedTablePrincipalPrimaryKeyProperty.FindContainingPrimaryKey().GetName();
            }

            var builder = new StringBuilder();
            var tableName = key.DeclaringEntityType.GetTableName();

            if (key.IsPrimaryKey())
            {
                builder.Append(tableName)
                    .Append("_pkey");
            }
            else
            {
                builder.Append(tableName)
                    .Append("_")
                    .AppendJoin("_", key.Properties.Select(p => p.GetColumnName()))
                    .Append("_akey");
            }

            return Uniquifier.Truncate(builder.ToString(), key.DeclaringEntityType.Model.GetMaxIdentifierLength());
        }
    }
}
