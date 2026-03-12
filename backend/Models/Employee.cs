using System.ComponentModel.DataAnnotations;

namespace EmployeeRegistry.Models
{
    public class Employee
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string NID { get; set; } = string.Empty; // Unique, 10 or 17 digits
        
        [Required]
        public string PhoneNumber { get; set; } = string.Empty; // BD format
        
        [Required]
        public string Department { get; set; } = string.Empty;
        
        [Required]
        public decimal BasicSalary { get; set; }
        
        // Navigation properties
        public virtual Spouse? Spouse { get; set; }
        public virtual ICollection<Child> Children { get; set; } = new List<Child>();
    }
}
