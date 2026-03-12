using EmployeeRegistry.DTOs;
using EmployeeRegistry.Validators;
using Xunit;

namespace EmployeeRegistry.Tests.Validators
{
    public class EmployeeValidatorTests
    {
        private readonly CreateEmployeeDtoValidator _validator;

        public EmployeeValidatorTests()
        {
            _validator = new CreateEmployeeDtoValidator();
        }

        [Theory]
        [InlineData("1234567890")] // 10 digits
        [InlineData("12345678901234567")] // 17 digits
        public void NID_ShouldBeValid_WhenLengthIs10Or17Digits(string nid)
        {
            var dto = new CreateEmployeeDto { NID = nid, Name = "Test", PhoneNumber = "01711223344", Department = "IT", BasicSalary = 50000 };
            var result = _validator.Validate(dto);
            Assert.True(result.IsValid);
        }

        [Theory]
        [InlineData("123456789")] // 9 digits
        [InlineData("12345678901")] // 11 digits
        [InlineData("1234567890123456")] // 16 digits
        [InlineData("123456789012345678")] // 18 digits
        [InlineData("ABC4567890")] // Non-digits
        public void NID_ShouldBeInvalid_WhenLengthIsNot10Or17OrContainsNonDigits(string nid)
        {
            var dto = new CreateEmployeeDto { NID = nid, Name = "Test", PhoneNumber = "01711223344", Department = "IT", BasicSalary = 50000 };
            var result = _validator.Validate(dto);
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "NID");
        }

        [Theory]
        [InlineData("01711223344")]
        [InlineData("+8801811223344")]
        public void PhoneNumber_ShouldBeValid_WhenMatchesBangladeshFormat(string phone)
        {
            var dto = new CreateEmployeeDto { PhoneNumber = phone, Name = "Test", NID = "1234567890", Department = "IT", BasicSalary = 50000 };
            var result = _validator.Validate(dto);
            Assert.True(result.IsValid);
        }

        [Theory]
        [InlineData("1711223344")] // Missing leading 0
        [InlineData("02711223344")] // Wrong prefix
        [InlineData("0171122334")] // Too short
        [InlineData("017112233444")] // Too long
        [InlineData("017112233AA")] // Non-digits
        public void PhoneNumber_ShouldBeInvalid_WhenFormatIsIncorrect(string phone)
        {
            var dto = new CreateEmployeeDto { PhoneNumber = phone, Name = "Test", NID = "1234567890", Department = "IT", BasicSalary = 50000 };
            var result = _validator.Validate(dto);
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "PhoneNumber");
        }
    }
}
