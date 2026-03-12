using EmployeeRegistry.Reports;
using EmployeeRegistry.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuestPDF.Fluent;

namespace EmployeeRegistry.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public ReportsController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet("employee-list")]
        public async Task<IActionResult> GetEmployeeListReport([FromQuery] string? search)
        {
            var employees = await _employeeService.GetAllEmployeesAsync(search);
            var report = new EmployeeListReport(employees);
            var pdf = report.GeneratePdf();
            
            return File(pdf, "application/pdf", $"EmployeeList_{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet("employee-cv/{id}")]
        public async Task<IActionResult> GetEmployeeCvReport(int id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);
            if (employee == null) return NotFound();

            var report = new EmployeeCvReport(employee);
            var pdf = report.GeneratePdf();
            
            return File(pdf, "application/pdf", $"{employee.Name.Replace(" ", "_")}_CV.pdf");
        }

        [HttpGet("test-pdf")]
        [AllowAnonymous]
        public IActionResult TestPdf()
        {
            // A simple valid minimal PDF
            string pdfContent = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R>>endobj\n4 0 obj<</Length 44>>stream\nBT /F1 24 Tf 100 700 Td (Hello World) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000242 00000 n\ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n335\n%%EOF";
            var bytes = System.Text.Encoding.ASCII.GetBytes(pdfContent);
            return File(bytes, "application/pdf", "test.pdf");
        }
    }
}
