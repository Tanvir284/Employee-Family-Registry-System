using EmployeeRegistry.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeRegistry.Repositories
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<Employee>> GetAllAsync(string? search);
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
            var query = _context.Employees
                .Include(e => e.Spouse)
                .Include(e => e.Children)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(e => 
                    e.Name.ToLower().Contains(search) || 
                    e.NID.Contains(search) || 
                    e.Department.ToLower().Contains(search));
            }

            return await query.ToListAsync();
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
    }
}
