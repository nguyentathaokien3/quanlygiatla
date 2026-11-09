using System.ComponentModel.DataAnnotations;

namespace LaundryManagement.API.Models
{
    public class KhachHang
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string TenKH { get; set; }
        [Required]
        public required string SoDienThoai { get; set; }
        public string? DiaChi { get; set; }
    }
}