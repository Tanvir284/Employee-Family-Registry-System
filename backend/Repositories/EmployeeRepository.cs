using EmployeeRegistry.DTOs;
using EmployeeRegistry.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeRegistry.Repositories
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<Employee>> GetAllAsync(string? search);
        Task<PagedResultDto<Employee>> GetPagedAsync(EmployeeQueryDto query);
        Task<EmployeeSummaryDto> GetSummaryAsync();
        Task<EmployeeDashboardDto> GetDashboardAsync();
        Task<Employee?> GetByIdAsync(int id);
        Task AddAsync(Employee employee);
        Task UpdateAsync(Employee employee);
        Task DeleteAsync(Employee employee);
        Task<bool> NIDExistsAsync(string nid, int? excludeId = null);
    }

    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly Data.AppDbContext _context;

        public EmployeeRepository(Data.AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Employee>> GetAllAsync(string? search)
        {
            var query = BuildFilteredQuery(new EmployeeQueryDto { Search = search });
            return await query.ToListAsync();
        }

        public async Task<PagedResultDto<Employee>> GetPagedAsync(EmployeeQueryDto query)
        {
            var safePage = query.Page < 1 ? 1 : query.Page;
            var safePageSize = query.PageSize < 1 ? 8 : Math.Min(query.PageSize, 100);

            var baseQuery = BuildFilteredQuery(query);
            var totalItems = await baseQuery.CountAsync();
            var totalPages = totalItems == 0 ? 0 : (int)Math.Ceiling(totalItems / (double)safePageSize);

            var items = await baseQuery
                .Skip((safePage - 1) * safePageSize)
                .Take(safePageSize)
                .ToListAsync();

            return new PagedResultDto<Employee>
            {
                Items = items,
                Page = safePage,
                PageSize = safePageSize,
                TotalItems = totalItems,
                TotalPages = totalPages
            };
        }

        public async Task<EmployeeSummaryDto> GetSummaryAsync()
        {
            var totalEmployees = await _context.Employees.CountAsync();
            var totalDepartments = await _context.Employees.Select(e => e.Department).Distinct().CountAsync();
            var averageSalary = await _context.Employees.Select(e => e.BasicSalary).DefaultIfEmpty(0).AverageAsync();

            var topDepartment = await _context.Employees
                .GroupBy(e => e.Department)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .FirstOrDefaultAsync();

            return new EmployeeSummaryDto
            {
                TotalEmployees = totalEmployees,
                TotalDepartments = totalDepartments,
                AverageSalary = Math.Round(averageSalary, 2),
                TopDepartment = topDepartment ?? "N/A"
            };
        }


        public async Task<EmployeeDashboardDto> GetDashboardAsync()
        {
            var summary = await GetSummaryAsync();
            var totalMonthlyPayroll = await _context.Employees.Select(e => e.BasicSalary).DefaultIfEmpty(0).SumAsync();
            var employeesWithSpouse = await _context.Employees.CountAsync(e => e.Spouse != null);
            var totalChildren = await _context.Children.CountAsync();

            var departmentInsights = await _context.Employees
                .GroupBy(e => e.Department)
                .Select(g => new DepartmentInsightDto
                {
                    Department = g.Key,
                    EmployeeCount = g.Count(),
                    AverageSalary = Math.Round(g.Average(x => x.BasicSalary), 2)
                })
                .OrderByDescending(x => x.EmployeeCount)
                .ThenBy(x => x.Department)
                .ToListAsync();

            var availableDepartments = departmentInsights.Select(x => x.Department).ToList();

            var topEmployees = await _context.Employees
                .OrderByDescending(e => e.BasicSalary)
                .ThenBy(e => e.Name)
                .Take(5)
                .Select(e => new TopEmployeeDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Department = e.Department,
                    Salary = e.BasicSalary
                })
                .ToListAsync();

            return new EmployeeDashboardDto
            {
                Summary = summary,
                TotalMonthlyPayroll = Math.Round(totalMonthlyPayroll, 2),
                EmployeesWithSpouse = employeesWithSpouse,
                TotalChildren = totalChildren,
                AvailableDepartments = availableDepartments,
                DepartmentInsights = departmentInsights,
                TopEmployees = topEmployees
            };
        }

        public async Task<Employee?> GetByIdAsync(int id)
        {
            return await _context.Employees
                .Include(e => e.Spouse)
                .Include(e => e.Children)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task AddAsync(Employee employee)
        {
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Employee employee)
        {
            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Employee employee)
        {
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> NIDExistsAsync(string nid, int? excludeId = null)
        {
            return await _context.Employees.AnyAsync(e => e.NID == nid && (!excludeId.HasValue || e.Id != excludeId.Value));
        }

        private IQueryable<Employee> BuildFilteredQuery(EmployeeQueryDto query)
        {
            var baseQuery = _context.Employees
                .AsNoTracking()
                .Include(e => e.Spouse)
                .Include(e => e.Children)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var pattern = $"%{query.Search.Trim()}%";
                baseQuery = baseQuery.Where(e =>
                    EF.Functions.ILike(e.Name, pattern) ||
                    EF.Functions.ILike(e.Department, pattern) ||
                    EF.Functions.ILike(e.NID, pattern));
            }

            if (!string.IsNullOrWhiteSpace(query.Department))
            {
                baseQuery = baseQuery.Where(e => e.Department == query.Department);
            }

            if (query.MinSalary.HasValue)
            {
                baseQuery = baseQuery.Where(e => e.BasicSalary >= query.MinSalary.Value);
            }

            if (query.MaxSalary.HasValue)
            {
                baseQuery = baseQuery.Where(e => e.BasicSalary <= query.MaxSalary.Value);
            }

            return (query.SortBy?.ToLowerInvariant(), query.SortDirection?.ToLowerInvariant()) switch
            {
                ("salary", "desc") => baseQuery.OrderByDescending(e => e.BasicSalary),
                ("salary", _) => baseQuery.OrderBy(e => e.BasicSalary),
                ("department", "desc") => baseQuery.OrderByDescending(e => e.Department),
                ("department", _) => baseQuery.OrderBy(e => e.Department),
                ("name", "desc") => baseQuery.OrderByDescending(e => e.Name),
                _ => baseQuery.OrderBy(e => e.Name)
            };
        }
    }
}
