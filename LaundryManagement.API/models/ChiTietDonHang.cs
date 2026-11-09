using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LaundryManagement.API.Models
{
    public class ChiTietDonHang
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int DonHangId { get; set; }

        [ForeignKey("DonHangId")]
        public DonHang? DonHang { get; set; }

        [Required]
        public int DichVuId { get; set; }

        [ForeignKey("DichVuId")]
        public DichVu? DichVu { get; set; }

        [Required]
        public int SoLuong { get; set; } // Số lượng (ví dụ: số kg hoặc số món)

        [Required]
        public decimal ThanhTien { get; set; } // Thành tiền cho dịch vụ này
    }
}