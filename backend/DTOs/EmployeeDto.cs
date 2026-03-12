namespace EmployeeRegistry.DTOs
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string NID { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public decimal BasicSalary { get; set; }
        
        public SpouseDto? Spouse { get; set; }
        public List<ChildDto> Children { get; set; } = new List<ChildDto>();
    }

    public class CreateEmployeeDto
    {
        public string Name { get; set; } = string.Empty;
        public string NID { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public decimal BasicSalary { get; set; }
        
        public CreateSpouseDto? Spouse { get; set; }
        public List<CreateChildDto> Children { get; set; } = new List<CreateChildDto>();
    }

    public class SpouseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string NID { get; set; } = string.Empty;
    }

    public class CreateSpouseDto
    {
        public string Name { get; set; } = string.Empty;
        public string NID { get; set; } = string.Empty;
    }

    public class ChildDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
    }

    public class CreateChildDto
    {
        public string Name { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
    }
}
