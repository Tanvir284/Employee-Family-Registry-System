using EmployeeRegistry.DTOs;
using EmployeeRegistry.Services;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeRegistry.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            if (result == null)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }
            return Ok(result);
        }


        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "ok" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!registerDto.Email.ToLower().EndsWith("@gmail.com"))
            {
                return BadRequest(new { message = "Only Gmail addresses are allowed." });
            }

            var result = await _authService.RegisterAsync(registerDto);
            if (!result)
            {
                return BadRequest(new { message = "Registration failed. Username or Email may already exist." });
            }

            return Ok(new { message = "Registration successful." });
        }
    }
}
