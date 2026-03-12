using EmployeeRegistry.DTOs;
using FluentValidation;
using System.Text.RegularExpressions;

namespace EmployeeRegistry.Validators
{
    public class CreateEmployeeDtoValidator : AbstractValidator<CreateEmployeeDto>
    {
        public CreateEmployeeDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            
            RuleFor(x => x.NID)
                .NotEmpty()
                .Must(nid => nid.Length == 10 || nid.Length == 17)
                .WithMessage("NID must be 10 or 17 digits.")
                .Matches(@"^\d+$")
                .WithMessage("NID must contain only digits.");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .Matches(@"^(01|\+8801)\d{9}$")
                .WithMessage("Phone must follow Bangladesh format (01XXXXXXXXX or +8801XXXXXXXXX).");

            RuleFor(x => x.Department).NotEmpty();
            RuleFor(x => x.BasicSalary).GreaterThan(0);
        }
    }
}
