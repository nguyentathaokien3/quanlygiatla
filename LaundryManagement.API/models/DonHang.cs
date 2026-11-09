using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LaundryManagement.API.Models
{
    public class DonHang
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int KhachHangId { get; set; }

        [ForeignKey("KhachHangId")]
        public KhachHang? KhachHang { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.Now;

        public decimal TongTien { get; set; }

        public string TrangThai { get; set; } = "Chờ xử lý";
    }
}