namespace DatingApp.API.Helper
{
    public class PaginationHeader
    {
        public PaginationHeader(int totalPages, int totalItems, int currentPage, int itemsPerPage)
        {
            this.TotalPages = totalPages;
            this.TotalItems = totalItems;
            this.CurrentPage = currentPage;
            this.PageSize = itemsPerPage;

        }
        public int TotalPages { get; set; }
        public int TotalItems { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
    }
}