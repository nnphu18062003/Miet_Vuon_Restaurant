# Hướng dẫn chạy ứng dụng bằng Docker

Để tránh việc phải restart server thủ công và dễ dàng quản lý Admin/Nhà hàng, chúng ta sử dụng Docker Compose.

## Yêu cầu
- Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/) và đang chạy.

## Cách chạy

### 1. Khởi động (Lần đầu hoặc khi có thay đổi package)
Mở Terminal tại thư mục dự án và chạy:

```powershell
docker-compose up --build
```
- Lệnh này sẽ:
  - Dựng lại project (`--build`).
  - Khởi tạo database Postgres.
  - Chạy các migration database.
  - Khởi động server với chế độ **Hot Reload** (bạn sửa code, server tự cập nhật, không cần restart).

### 2. Dừng ứng dụng
Nhấn `Ctrl + C` hoặc chạy:
```powershell
docker-compose down
```

### 3. Xem log (nếu đang chạy ngầm)
```powershell
docker-compose logs -f
```

## Lưu ý quan trọng
- **Web App**: Truy cập tại `http://localhost:4000`
- **Database**: Port `5432`.
- **Hot Reload**: Code trong thư mục máy tính được đồng bộ với Docker. Sửa file xong chỉ cần F5 trình duyệt.
- **Config**: Mọi cấu hình (Google, Cloudinary, Email) sẽ tự động lấy từ file `.env`. Đảm bảo file `.env` đã có đủ thông tin.

## Cấu trúc
Dù Admin và Nhà hàng là một mã nguồn (`server.js`), nhưng Docker giúp đóng gói nó thành một container duy nhất, chạy ổn định và dễ quản lý. Không cần tách riêng vì chúng dùng chung Database và logic.
