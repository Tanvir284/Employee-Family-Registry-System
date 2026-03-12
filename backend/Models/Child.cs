using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeRegistry.Models
{
    public class Child
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public DateTime DateOfBirth { get; set; }
        
        [Required]
        public int EmployeeId { get; set; }
        
        [ForeignKey("EmployeeId")]
        public virtual Employee? Employee { get; set; }
    }
}
