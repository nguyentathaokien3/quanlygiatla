using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LaundryManagement.API.Data;
using LaundryManagement.API.Models;

namespace LaundryManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChiTietDonHangsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChiTietDonHangsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ChiTietDonHangs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChiTietDonHang>>> GetChiTietDonHangs()
        {
            return await _context.ChiTietDonHangs
                .Include(c => c.DonHang)
                .Include(c => c.DichVu)
                .ToListAsync();
        }

        // POST: api/ChiTietDonHangs
        [HttpPost]
        public async Task<ActionResult<ChiTietDonHang>> PostChiTietDonHang(ChiTietDonHang chiTiet)
        {
            // Tự động tính thành tiền dựa trên đơn giá dịch vụ và số lượng
            var dichVu = await _context.DichVus.FindAsync(chiTiet.DichVuId);
            if (dichVu == null)
            {
                return BadRequest("Không tìm thấy dịch vụ tương ứng.");
            }

            chiTiet.ThanhTien = dichVu.DonGia * chiTiet.SoLuong;

            _context.ChiTietDonHangs.Add(chiTiet);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetChiTietDonHangs), new { id = chiTiet.Id }, chiTiet);
        }
    }
}