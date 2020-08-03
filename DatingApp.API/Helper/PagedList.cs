using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Helper
{
    public class PagedList<T> : List<T>
    {
        public PagedList(List<T> items, int pageNumber, int pageSize, int totalCount)
        {
            this.TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            this.CurrentPage = pageNumber;
            this.PageSize = pageSize;
            this.TotalCount = totalCount;
            this.AddRange(items);

        }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(items,pageNumber,pageSize,count);
        }
    }
}