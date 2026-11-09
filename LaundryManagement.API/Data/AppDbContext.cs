using Microsoft.EntityFrameworkCore;
using LaundryManagement.API.Models;

namespace LaundryManagement.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<KhachHang> KhachHangs { get; set; }
        public DbSet<DichVu> DichVus { get; set; }
        public DbSet<DonHang> DonHangs { get; set; }
        public DbSet<ChiTietDonHang> ChiTietDonHangs { get; set; }
        public DbSet<User> Users { get; set; }
    }
}