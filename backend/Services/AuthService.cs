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
            var identifier = loginDto.Username?.Trim();
            if (string.IsNullOrWhiteSpace(identifier) || string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return null;
            }

            var normalizedIdentifier = identifier.ToLower();

            var user = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.Username.ToLower() == normalizedIdentifier ||
                    u.Email.ToLower() == normalizedIdentifier);

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
            var username = registerDto.Username?.Trim();
            var email = registerDto.Email?.Trim().ToLower();

            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(registerDto.Password))
            {
                return false;
            }

            // Gmail validation
            if (!email.EndsWith("@gmail.com"))
            {
                return false;
            }

            // Uniqueness check (case-insensitive)
            if (await _context.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower() || u.Email.ToLower() == email))
            {
                return false;
            }

            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = "Viewer" // Default role
            };

            _context.Users.Add(user);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
