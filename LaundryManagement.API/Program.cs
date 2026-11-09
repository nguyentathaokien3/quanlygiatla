using LaundryManagement.API.Data;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// [QUAN TRỌNG CHO RENDER] Lấy cổng PORT do Render cấp phát tự động (mặc định 8080 nếu chạy local)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://*:{port}");

// 1. Đăng ký kết nối Database SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Đăng ký Controllers
builder.Services.AddControllers();

// 3. Đăng ký OpenAPI chính chủ của .NET
builder.Services.AddOpenApi();

// Đăng ký CORS cho phép Front-end truy cập
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// 4. Kích hoạt giao diện Scalar UI 
// (Nếu muốn dùngScalar cả trên Production khi lên Render thì bỏ điều kiện app.Environment.IsDevelopment())
app.MapOpenApi();
app.MapScalarApiReference(); // Truy cập giao diện tại /scalar/v1

app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles(); // Cho phép đọc file tĩnh từ thư mục wwwroot

app.Run();