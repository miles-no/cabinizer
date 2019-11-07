using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Cabinizer.Data;
using Cabinizer.Models;
using Microsoft.EntityFrameworkCore;

namespace Cabinizer
{
    public static class QueryableExtensions
    {
        public static Task<T> FindByIdAsync<T, TKey>(this IQueryable<T> source, TKey id, CancellationToken cancellationToken)
            where T : Entity<TKey>
            where TKey : notnull
        {
            return source.SingleOrDefaultAsync(x => x.Id.Equals(id), cancellationToken);
        }

        public static async Task<PagedResultModel<T>> PagedAsync<T>(this IQueryable<T> source, PagedQueryModel query, CancellationToken cancellationToken)
        {
            var totalItemCount = await source.CountAsync(cancellationToken);

            var page = query.Page ?? 1;
            var size = query.Size ?? 30;

            var pageSize = Math.Clamp(size, min: 1, max: 200);
            var pageCount = (totalItemCount - 1) / pageSize + 1;
            var pageNumber = Math.Clamp(page, min: 1, max: pageCount);

            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);

            return new PagedResultModel<T>(items, pageNumber, pageCount, totalItemCount);
        }
    }
}
