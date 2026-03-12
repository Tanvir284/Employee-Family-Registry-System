using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeRegistry.Models
{
    public class Spouse
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string NID { get; set; } = string.Empty;
        
        [Required]
        public int EmployeeId { get; set; }
        
        [ForeignKey("EmployeeId")]
        public virtual Employee? Employee { get; set; }
    }
}
