using System.ComponentModel.DataAnnotations;

namespace LaundryManagement.API.Models
{
    public class DichVu
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public required string TenDichVu { get; set; }
        
        [Required]
        public decimal DonGia { get; set; }
        
        [Required]
        public required string DonViTinh { get; set; }

        // 🌟 Bổ sung trường mô tả loại quần áo / quy trình giặt
        public string? MoTa { get; set; }

        // 🌟 Bổ sung trường lưu đường dẫn (URL) hình ảnh minh họa
        public string? HinhAnh { get; set; }
    }
}