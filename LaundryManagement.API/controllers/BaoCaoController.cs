using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LaundryManagement.API.Data;

namespace LaundryManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaoCaoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BaoCaoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/BaoCao/ThongKe
        [HttpGet("ThongKe")]
        public async Task<IActionResult> GetThongKe()
        {
            var tongDoanhThu = await _context.DonHangs.SumAsync(d => d.TongTien);
            var tongDonHang = await _context.DonHangs.CountAsync();
            var tongKhachHang = await _context.KhachHangs.CountAsync();

            return Ok(new
            {
                TongDoanhThu = tongDoanhThu,
                TongDonHang = tongDonHang,
                TongKhachHang = tongKhachHang
            });
        }
    }
}