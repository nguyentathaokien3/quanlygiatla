using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LaundryManagement.API.Data;
using LaundryManagement.API.Models;

namespace LaundryManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonHangsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DonHangsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/DonHangs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DonHang>>> GetDonHangs()
        {
            return await _context.DonHangs
                .Include(d => d.KhachHang) // Lấy kèm thông tin khách hàng
                .ToListAsync();
        }

        // POST: api/DonHangs
        [HttpPost]
        public async Task<ActionResult<DonHang>> PostDonHang(DonHang donHang)
        {
            donHang.NgayTao = DateTime.Now;
            _context.DonHangs.Add(donHang);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDonHangs), new { id = donHang.Id }, donHang);
        }
        // PUT: api/DonHangs/5/trang-thai
        [HttpPut("{id}/trang-thai")]
        public async Task<IActionResult> UpdateTrangThai(int id, [FromBody] string trangThaiMoi)
        {
            var donHang = await _context.DonHangs.FindAsync(id);
            if (donHang == null)
            {
                return NotFound("Không tìm thấy đơn hàng.");
            }

            donHang.TrangThai = trangThaiMoi;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}