using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LaundryManagement.API.Migrations
{
    /// <inheritdoc />
    public partial class AddMoTaAndHinhAnhToDichVu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HinhAnh",
                table: "DichVus",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MoTa",
                table: "DichVus",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HinhAnh",
                table: "DichVus");

            migrationBuilder.DropColumn(
                name: "MoTa",
                table: "DichVus");
        }
    }
}
