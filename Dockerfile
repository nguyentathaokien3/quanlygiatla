# --- Giai đoạn 1: Build Frontend (React) ---
FROM node:18 AS build-frontend
WORKDIR /app-frontend
COPY laundry-management-frontend/package*.json ./
RUN npm install
COPY laundry-management-frontend/ ./
RUN npm run build

# --- Giai đoạn 2: Build Backend (.NET 8) ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-backend
WORKDIR /app
COPY LaundryManagement.API/*.csproj ./
RUN dotnet restore
COPY LaundryManagement.API/ ./
RUN dotnet publish -c Release -o /out

# --- Giai đoạn 3: Đóng gói chạy thật ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build-backend /out .

# Copy kết quả build React vào wwwroot của .NET
COPY --from=build-frontend /app-frontend/dist /app/wwwroot

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "LaundryManagement.API.dll"]