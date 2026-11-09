# Sử dụng .NET SDK chính thức để build ứng dụng
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy file csproj và restore các gói thư viện
COPY ["LaundryManagement.API.csproj", "./"]
RUN dotnet restore "LaundryManagement.API.csproj"

# Copy toàn bộ mã nguồn còn lại và publish
COPY . .
RUN dotnet publish "LaundryManagement.API.csproj" -c Release -o /app/publish

# Sử dụng ASP.NET Runtime để chạy ứng dụng (dung lượng nhẹ hơn)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Cấu hình port động theo Render
ENV ASPNETCORE_URLS=http://*:$PORT
ENTRYPOINT ["dotnet", "LaundryManagement.API.dll"]