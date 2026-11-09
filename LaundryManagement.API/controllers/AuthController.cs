using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LaundryManagement.API.Data;
using LaundryManagement.API.Models;
using BCrypt.Net;

namespace LaundryManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // ĐĂNG KÝ
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto model)
        {
            if (await _context.Users.AnyAsync(u => u.Username == model.Username))
            {
                return BadRequest("Tài khoản đã tồn tại!");
            }

            // Mã hóa mật khẩu bằng BCrypt
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

            var user = new User
            {
                Username = model.Username,
                PasswordHash = passwordHash
            };

            _context.Users.Add(user);

            // 🌟 TỰ ĐỘNG ĐỒNG BỘ: Tạo luôn thông tin trong bảng KhachHangs để Admin thấy ngay
            var existingKhachHang = await _context.KhachHangs.FirstOrDefaultAsync(k => k.TenKH == model.Username);
            if (existingKhachHang == null)
            {
                var khachHang = new KhachHang
                {
                    TenKH = model.Username,
                    SoDienThoai = "Chưa cập nhật",
                    DiaChi = "Chưa cập nhật"
                };
                _context.KhachHangs.Add(khachHang);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công!" });
        }

        // ĐĂNG NHẬP
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserDto model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
            {
                return Unauthorized("Sai tên đăng nhập hoặc mật khẩu!");
            }

            // Tạo Token JWT
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, user.Username) }),
                Expires = DateTime.UtcNow.AddDays(1),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { Token = tokenString, Username = user.Username });
        }
    }

    public class UserDto
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}