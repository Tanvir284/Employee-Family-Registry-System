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

    public class DepartmentInsightDto
    {
        public string Department { get; set; } = string.Empty;
        public int EmployeeCount { get; set; }
        public decimal AverageSalary { get; set; }
    }

    public class TopEmployeeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public decimal Salary { get; set; }
    }

    public class EmployeeDashboardDto
    {
        public EmployeeSummaryDto Summary { get; set; } = new();
        public decimal TotalMonthlyPayroll { get; set; }
        public int EmployeesWithSpouse { get; set; }
        public int TotalChildren { get; set; }
        public IReadOnlyList<string> AvailableDepartments { get; set; } = Array.Empty<string>();
        public IReadOnlyList<DepartmentInsightDto> DepartmentInsights { get; set; } = Array.Empty<DepartmentInsightDto>();
        public IReadOnlyList<TopEmployeeDto> TopEmployees { get; set; } = Array.Empty<TopEmployeeDto>();
    }
}
