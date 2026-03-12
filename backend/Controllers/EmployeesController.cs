using EmployeeRegistry.DTOs;
using EmployeeRegistry.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeRegistry.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDto<EmployeeDto>>> GetAll([FromQuery] EmployeeQueryDto query)
        {
            var employees = await _employeeService.GetEmployeesAsync(query);
            return Ok(employees);
        }

        [HttpGet("summary")]
        public async Task<ActionResult<EmployeeSummaryDto>> GetSummary()
        {
            var summary = await _employeeService.GetSummaryAsync();
            return Ok(summary);
        }


        [HttpGet("dashboard")]
        public async Task<ActionResult<EmployeeDashboardDto>> GetDashboard()
        {
            var dashboard = await _employeeService.GetDashboardAsync();
            return Ok(dashboard);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDto>> GetById(int id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);
            if (employee == null) return NotFound();
            return Ok(employee);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EmployeeDto>> Create([FromBody] CreateEmployeeDto createDto)
        {
            try
            {
                var employee = await _employeeService.CreateEmployeeAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = employee.Id }, employee);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateEmployeeDto updateDto)
        {
            try
            {
                var success = await _employeeService.UpdateEmployeeAsync(id, updateDto);
                if (!success) return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _employeeService.DeleteEmployeeAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
