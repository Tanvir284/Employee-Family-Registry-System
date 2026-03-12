using EmployeeRegistry.DTOs;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace EmployeeRegistry.Reports
{
    public class EmployeeListReport : IDocument
    {
        private readonly IEnumerable<EmployeeDto> _employees;

        public EmployeeListReport(IEnumerable<EmployeeDto> employees)
        {
            _employees = employees;
        }

        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
                page.Margin(50);
                page.Header().Text("Employee List Report").FontSize(24).SemiBold().FontColor(Colors.Blue.Medium);
                
                page.Content().PaddingVertical(20).Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn(3);
                        columns.RelativeColumn(2);
                        columns.RelativeColumn(2);
                    });

                    table.Header(header =>
                    {
                        header.Cell().BorderBottom(1).Padding(5).Text("Name").SemiBold();
                        header.Cell().BorderBottom(1).Padding(5).Text("Department").SemiBold();
                        header.Cell().BorderBottom(1).Padding(5).Text("Phone").SemiBold();
                    });

                    foreach (var employee in _employees)
                    {
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(employee.Name ?? "N/A");
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(employee.Department ?? "N/A");
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(employee.PhoneNumber ?? "N/A");
                    }
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Page ");
                    x.CurrentPageNumber();
                    x.Span(" of ");
                    x.TotalPages();
                });
            });
        }
    }

    public class EmployeeCvReport : IDocument
    {
        private readonly EmployeeDto _employee;

        public EmployeeCvReport(EmployeeDto employee)
        {
            _employee = employee;
        }

        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
                page.Margin(50);
                
                page.Header().Column(col =>
                {
                    col.Item().Text(_employee.Name ?? "N/A").FontSize(28).Bold().FontColor(Colors.Blue.Medium);
                    col.Item().Text(_employee.Department ?? "N/A").FontSize(16).Italic();
                });

                page.Content().PaddingVertical(20).Column(col =>
                {
                    col.Item().PaddingBottom(5).Text("Personal Details").FontSize(18).SemiBold().Underline();
                    col.Item().Text($"NID: {_employee.NID ?? "N/A"}");
                    col.Item().Text($"Phone: {_employee.PhoneNumber ?? "N/A"}");
                    col.Item().Text($"Basic Salary: {_employee.BasicSalary:N0}");

                    if (_employee.Spouse != null)
                    {
                        col.Item().PaddingTop(20).PaddingBottom(5).Text("Spouse Information").FontSize(18).SemiBold().Underline();
                        col.Item().Text($"Name: {_employee.Spouse.Name ?? "N/A"}");
                        col.Item().Text($"NID: {_employee.Spouse.NID ?? "N/A"}");
                    }

                    if (_employee.Children != null && _employee.Children.Any())
                    {
                        col.Item().PaddingTop(20).PaddingBottom(5).Text("Children").FontSize(18).SemiBold().Underline();
                        foreach (var child in _employee.Children)
                        {
                            col.Item().Text($"• {child.Name ?? "N/A"} (DOB: {child.DateOfBirth:dd MMM yyyy})");
                        }
                    }
                });

                page.Footer().AlignCenter().Text(t =>
                {
                    t.Span("Generated on: ");
                    t.Span(DateTime.Now.ToString("f")).FontSize(10);
                });
            });
        }
    }
}
