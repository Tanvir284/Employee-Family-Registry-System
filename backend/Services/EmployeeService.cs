using EmployeeRegistry.DTOs;
using EmployeeRegistry.Models;
using EmployeeRegistry.Repositories;

namespace EmployeeRegistry.Services
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync(string? search);
        Task<PagedResultDto<EmployeeDto>> GetEmployeesAsync(EmployeeQueryDto query);
        Task<EmployeeSummaryDto> GetSummaryAsync();
        Task<EmployeeDashboardDto> GetDashboardAsync();
        Task<EmployeeDto?> GetEmployeeByIdAsync(int id);
        Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto createDto);
        Task<bool> UpdateEmployeeAsync(int id, CreateEmployeeDto updateDto);
        Task<bool> DeleteEmployeeAsync(int id);
    }

    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _repository;

        public EmployeeService(IEmployeeRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync(string? search)
        {
            var employees = await _repository.GetAllAsync(search);
            return employees.Select(MapToDto);
        }

        public async Task<PagedResultDto<EmployeeDto>> GetEmployeesAsync(EmployeeQueryDto query)
        {
            var pagedResult = await _repository.GetPagedAsync(query);

            return new PagedResultDto<EmployeeDto>
            {
                Items = pagedResult.Items.Select(MapToDto).ToList(),
                Page = pagedResult.Page,
                PageSize = pagedResult.PageSize,
                TotalItems = pagedResult.TotalItems,
                TotalPages = pagedResult.TotalPages
            };
        }

        public async Task<EmployeeSummaryDto> GetSummaryAsync()
        {
            return await _repository.GetSummaryAsync();
        }

        public async Task<EmployeeDashboardDto> GetDashboardAsync()
        {
            return await _repository.GetDashboardAsync();
        }

        public async Task<EmployeeDto?> GetEmployeeByIdAsync(int id)
        {
            var employee = await _repository.GetByIdAsync(id);
            return employee == null ? null : MapToDto(employee);
        }

        public async Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto createDto)
        {
            if (await _repository.NIDExistsAsync(createDto.NID))
            {
                throw new Exception("NID must be unique.");
            }

            var employee = new Employee
            {
                Name = createDto.Name,
                NID = createDto.NID,
                PhoneNumber = createDto.PhoneNumber,
                Department = createDto.Department,
                BasicSalary = createDto.BasicSalary,
                Spouse = createDto.Spouse == null ? null : new Spouse
                {
                    Name = createDto.Spouse.Name,
                    NID = createDto.Spouse.NID
                },
                Children = createDto.Children.Select(c => new Child
                {
                    Name = c.Name,
                    DateOfBirth = c.DateOfBirth
                }).ToList()
            };

            await _repository.AddAsync(employee);
            return MapToDto(employee);
        }

        public async Task<bool> UpdateEmployeeAsync(int id, CreateEmployeeDto updateDto)
        {
            var employee = await _repository.GetByIdAsync(id);
            if (employee == null) return false;

            if (await _repository.NIDExistsAsync(updateDto.NID, id))
            {
                throw new Exception("NID must be unique.");
            }

            employee.Name = updateDto.Name;
            employee.NID = updateDto.NID;
            employee.PhoneNumber = updateDto.PhoneNumber;
            employee.Department = updateDto.Department;
            employee.BasicSalary = updateDto.BasicSalary;

            if (updateDto.Spouse == null)
            {
                employee.Spouse = null;
            }
            else
            {
                if (employee.Spouse == null) employee.Spouse = new Spouse();
                employee.Spouse.Name = updateDto.Spouse.Name;
                employee.Spouse.NID = updateDto.Spouse.NID;
            }

            employee.Children.Clear();
            foreach (var childDto in updateDto.Children)
            {
                employee.Children.Add(new Child
                {
                    Name = childDto.Name,
                    DateOfBirth = childDto.DateOfBirth
                });
            }

            await _repository.UpdateAsync(employee);
            return true;
        }

        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            var employee = await _repository.GetByIdAsync(id);
            if (employee == null) return false;

            await _repository.DeleteAsync(employee);
            return true;
        }

        private static EmployeeDto MapToDto(Employee employee)
        {
            return new EmployeeDto
            {
                Id = employee.Id,
                Name = employee.Name,
                NID = employee.NID,
                PhoneNumber = employee.PhoneNumber,
                Department = employee.Department,
                BasicSalary = employee.BasicSalary,
                Spouse = employee.Spouse == null ? null : new SpouseDto
                {
                    Id = employee.Spouse.Id,
                    Name = employee.Spouse.Name,
                    NID = employee.Spouse.NID
                },
                Children = employee.Children.Select(c => new ChildDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    DateOfBirth = c.DateOfBirth
                }).ToList()
            };
        }
    }
}
