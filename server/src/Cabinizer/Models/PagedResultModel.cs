using System.Collections.Generic;

namespace Cabinizer.Models
{
    public class PagedResultModel<T>
    {
        public PagedResultModel(IReadOnlyCollection<T> items, int pageNumber, int pageCount, int totalItemCount)
        {
            Items = items;
            PageNumber = pageNumber;
            PageCount = pageCount;
            TotalItemCount = totalItemCount;
        }

        public IReadOnlyCollection<T> Items { get; }

        public int PageNumber { get; }

        public int PageCount { get; }

        public int TotalItemCount { get; }

        public int ItemCount => Items.Count;

        public bool HasPreviousPage => PageNumber > 1;

        public bool HasNextPage => PageNumber < PageCount;
    }

    public class PagedQueryModel
    {
        public int? Page { get; set; }

        public int? Size { get; set; }
    }
}
