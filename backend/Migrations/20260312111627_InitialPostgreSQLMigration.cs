using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace EmployeeRegistry.Migrations
{
    public partial class InitialPostgreSQLMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    NID = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber = table.Column<string>(type: "text", nullable: false),
                    Department = table.Column<string>(type: "text", nullable: false),
                    BasicSalary = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Children",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EmployeeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Children", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Children_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Spouses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    NID = table.Column<string>(type: "text", nullable: false),
                    EmployeeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Spouses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Spouses_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "BasicSalary", "Department", "NID", "Name", "PhoneNumber" },
                values: new object[,]
                {
                    { 1, 50000m, "IT", "1234567890", "Tanvir Islam", "01712345678" },
                    { 2, 45000m, "HR", "1234567891", "Rahim Uddin", "01812345679" },
                    { 3, 48000m, "Finance", "1234567892", "Karim Ahmed", "01912345680" },
                    { 4, 52000m, "IT", "1234567893", "Sadia Afrin", "01512345681" },
                    { 5, 42000m, "Marketing", "1234567894", "Nusrat Jahan", "01612345682" },
                    { 6, 40000m, "Sales", "1234567895", "Abul Kashem", "01312345683" },
                    { 7, 46000m, "HR", "1234567896", "Fatima Zohra", "01412345684" },
                    { 8, 47000m, "Operations", "1234567897", "Kamal Hossain", "01712345685" },
                    { 9, 51000m, "IT", "1234567898", "Mitu Akter", "01812345686" },
                    { 10, 44000m, "Admin", "1234567899", "Zahid Hasan", "01912345687" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "PasswordHash", "Role", "Username" },
                values: new object[,]
                {
                    { 1, "$2a$11$0J3fwrgyUWx.3IU0stZ.ouvA5Tu1HBGnkOO.wtdORK293jTzFhATu", "Admin", "admin" },
                    { 2, "$2a$11$.CiIqxneksNMGkWRiLEeceTWOnjZ8UQ5rJqd16C9Uito9aesQeFJe", "Viewer", "viewer" }
                });

            migrationBuilder.InsertData(
                table: "Children",
                columns: new[] { "Id", "DateOfBirth", "EmployeeId", "Name" },
                values: new object[,]
                {
                    { 1, new DateTime(2015, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "Ayan Islam" },
                    { 2, new DateTime(2018, 10, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "Sara Islam" },
                    { 3, new DateTime(2016, 2, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, "Rayhan Uddin" }
                });

            migrationBuilder.InsertData(
                table: "Spouses",
                columns: new[] { "Id", "EmployeeId", "NID", "Name" },
                values: new object[,]
                {
                    { 1, 1, "9876543210", "Farhana Yasmin" },
                    { 2, 2, "9876543211", "Sumaiya Akter" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Children_EmployeeId",
                table: "Children",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_NID",
                table: "Employees",
                column: "NID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Spouses_EmployeeId",
                table: "Spouses",
                column: "EmployeeId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Children");

            migrationBuilder.DropTable(
                name: "Spouses");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Employees");
        }
    }
}
