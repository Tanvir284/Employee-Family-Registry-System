using EmployeeRegistry.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace EmployeeRegistry.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Spouse> Spouses { get; set; }
        public DbSet<Child> Children { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Employee NID uniqueness
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.NID)
                .IsUnique();

            // Employee - Spouse (One-to-One)
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Spouse)
                .WithOne(s => s.Employee)
                .HasForeignKey<Spouse>(s => s.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Employee - Children (One-to-Many)
            modelBuilder.Entity<Employee>()
                .HasMany(e => e.Children)
                .WithOne(c => c.Employee)
                .HasForeignKey(c => c.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "admin", Email = "admin@gmail.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"), Role = "Admin" },
                new User { Id = 2, Username = "viewer", Email = "viewer@gmail.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("viewer123"), Role = "Viewer" }
            );

            // Seed Employees
            modelBuilder.Entity<Employee>().HasData(
                new Employee { Id = 1, Name = "Tanvir Islam", NID = "1234567890", PhoneNumber = "01712345678", Department = "IT", BasicSalary = 50000 },
                new Employee { Id = 2, Name = "Rahim Uddin", NID = "1234567891", PhoneNumber = "01812345679", Department = "HR", BasicSalary = 45000 },
                new Employee { Id = 3, Name = "Karim Ahmed", NID = "1234567892", PhoneNumber = "01912345680", Department = "Finance", BasicSalary = 48000 },
                new Employee { Id = 4, Name = "Sadia Afrin", NID = "1234567893", PhoneNumber = "01512345681", Department = "IT", BasicSalary = 52000 },
                new Employee { Id = 5, Name = "Nusrat Jahan", NID = "1234567894", PhoneNumber = "01612345682", Department = "Marketing", BasicSalary = 42000 },
                new Employee { Id = 6, Name = "Abul Kashem", NID = "1234567895", PhoneNumber = "01312345683", Department = "Sales", BasicSalary = 40000 },
                new Employee { Id = 7, Name = "Fatima Zohra", NID = "1234567896", PhoneNumber = "01412345684", Department = "HR", BasicSalary = 46000 },
                new Employee { Id = 8, Name = "Kamal Hossain", NID = "1234567897", PhoneNumber = "01712345685", Department = "Operations", BasicSalary = 47000 },
                new Employee { Id = 9, Name = "Mitu Akter", NID = "1234567898", PhoneNumber = "01812345686", Department = "IT", BasicSalary = 51000 },
                new Employee { Id = 10, Name = "Zahid Hasan", NID = "1234567899", PhoneNumber = "01912345687", Department = "Admin", BasicSalary = 44000 }
            );

            // Seed Spouses for some employees
            modelBuilder.Entity<Spouse>().HasData(
                new Spouse { Id = 1, Name = "Farhana Yasmin", NID = "9876543210", EmployeeId = 1 },
                new Spouse { Id = 2, Name = "Sumaiya Akter", NID = "9876543211", EmployeeId = 2 }
            );

            // Seed Children for some employees
            modelBuilder.Entity<Child>().HasData(
                new Child { Id = 1, Name = "Ayan Islam", DateOfBirth = new DateTime(2015, 5, 20), EmployeeId = 1 },
                new Child { Id = 2, Name = "Sara Islam", DateOfBirth = new DateTime(2018, 10, 10), EmployeeId = 1 },
                new Child { Id = 3, Name = "Rayhan Uddin", DateOfBirth = new DateTime(2016, 2, 15), EmployeeId = 2 }
            );
        }
    }
}
