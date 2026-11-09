using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LaundryManagement.API.Data;
using LaundryManagement.API.Models;

namespace LaundryManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DichVusController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DichVusController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/DichVus
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DichVu>>> GetDichVus()
        {
            return await _context.DichVus.ToListAsync();
        }

        // POST: api/DichVus
        [HttpPost]
        public async Task<ActionResult<DichVu>> PostDichVu(DichVu dichVu)
        {
            _context.DichVus.Add(dichVu);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDichVus), new { id = dichVu.Id }, dichVu);
        }

        // PUT: api/DichVus/5 (BỔ SUNG HÀM NÀY ĐỂ FIX LỖI 404 KHI LƯU THAY ĐỔI)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDichVu(int id, [FromForm] DichVu dichVu, IFormFile? imageFile)
        {
            if (id != dichVu.Id)
            {
                return BadRequest(new { message = "ID dịch vụ không khớp!" });
            }

            // Xử lý lưu hình ảnh nếu người dùng có chọn ảnh mới upload lên
            if (imageFile != null && imageFile.Length > 0)
            {
                // Tạo tên file độc lập tránh trùng lặp
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);

                // Đảm bảo thư mục images tồn tại
                Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images"));

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                // Cập nhật đường dẫn ảnh vào object (Giả sử model của bạn có thuộc tính HinhAnh/ImageUrl)
                // dichVu.HinhAnh = "/images/" + fileName;
            }

            _context.Entry(dichVu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.DichVus.Any(e => e.Id == id))
                {
                    return NotFound(new { message = "Không tìm thấy dịch vụ cần cập nhật!" });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { message = "Cập nhật thành công!", data = dichVu });
        }
    }
}