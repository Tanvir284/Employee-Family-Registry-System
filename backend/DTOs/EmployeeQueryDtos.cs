namespace EmployeeRegistry.DTOs
{
    public class EmployeeQueryDto
    {
        public string? Search { get; set; }
        public string? Department { get; set; }
        public decimal? MinSalary { get; set; }
        public decimal? MaxSalary { get; set; }
        public string? SortBy { get; set; } = "name";
        public string? SortDirection { get; set; } = "asc";
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 8;
    }

    public class PagedResultDto<T>
    {
        public IReadOnlyList<T> Items { get; set; } = Array.Empty<T>();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }

    public class EmployeeSummaryDto
    {
        public int TotalEmployees { get; set; }
        public int TotalDepartments { get; set; }
        public decimal AverageSalary { get; set; }
        public string TopDepartment { get; set; } = "N/A";
    }
}
