using EmployeeRegistry.Auth;
using EmployeeRegistry.Data;
using EmployeeRegistry.DTOs;
using Microsoft.EntityFrameworkCore;
using EmployeeRegistry.Models;
using BCrypt.Net;

namespace EmployeeRegistry.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
        Task<bool> RegisterAsync(RegisterDto registerDto);
    }

    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return null;
            }

            var secret = _configuration["Jwt:Secret"] ?? "SuperSecretKeyForEmployeeRegistry2026_MustBeLongEnough!";
            var expiry = int.Parse(_configuration["Jwt:ExpiryInMinutes"] ?? "1440");

            var token = JwtHelper.GenerateToken(user, secret, expiry);

            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Role = user.Role
            };
        }

        public async Task<bool> RegisterAsync(RegisterDto registerDto)
        {
            // Gmail validation
            if (!registerDto.Email.ToLower().EndsWith("@gmail.com"))
            {
                return false;
            }

            // Uniqueness check
            if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username || u.Email == registerDto.Email))
            {
                return false;
            }

            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = "Viewer" // Default role
            };

            _context.Users.Add(user);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
