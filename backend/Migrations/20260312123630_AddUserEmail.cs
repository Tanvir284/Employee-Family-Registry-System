using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeRegistry.Migrations
{
    public partial class AddUserEmail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateOfBirth",
                table: "Children",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Email", "PasswordHash" },
                values: new object[] { "admin@gmail.com", "$2a$11$A.GmRPpe4njYRlAkTlvDkOeHTH.ZCLUXdZ/JtVwpC/2fOee4D4Xa2" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Email", "PasswordHash" },
                values: new object[] { "viewer@gmail.com", "$2a$11$bamqA5ZGBBS2xyW93mw7JOwuv3t8FnOjzeFpcmq8B27SqvNZbkFJ." });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Users");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateOfBirth",
                table: "Children",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$0J3fwrgyUWx.3IU0stZ.ouvA5Tu1HBGnkOO.wtdORK293jTzFhATu");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$.CiIqxneksNMGkWRiLEeceTWOnjZ8UQ5rJqd16C9Uito9aesQeFJe");
        }
    }
}
