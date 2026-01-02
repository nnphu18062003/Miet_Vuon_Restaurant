# Miet Vuon Restaurant 

Dự án website nhà hàng Miệt Vườn.

## Hướng Dẫn Chạy Source Code bằng Docker

Để chạy dự án này một cách dễ dàng nhất, bạn có thể sử dụng Docker và Docker Compose. Cách này giúp bạn không cần cài đặt node_modules hay PostgreSQL thủ công trên máy.

### Tiên quyết
Máy tính của bạn cần được cài đặt:
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/) (Thường đi kèm với Docker Desktop)

### Các bước thực hiện

1.  **Clone source code** về máy (nếu chưa có).
    ```bash
    git clone <repository-url>
    cd Miet_Vuon_Restaurant
    ```

2.  **Khởi chạy ứng dụng**
    Mở terminal tại thư mục gốc của dự án và chạy lệnh sau:
    ```bash
    docker-compose up -d --build
    ```
    *Lệnh này sẽ:*
    *   *Build image cho ứng dụng Node.js.*
    *   *Tải image PostgreSQL.*
    *   *Khởi tạo database và seed dữ liệu (nếu được cấu hình).*
    *   *Start server ở chế độ background.*

3.  **Truy cập ứng dụng**
    Sau khi lệnh chạy hoàn tất, bạn có thể truy cập website tại địa chỉ:
    [http://localhost:4000](http://localhost:4000)

### Các lệnh Docker hữu ích khác

*   **Xem logs:** (để kiểm tra xem server đã khởi động xong chưa hoặc debug lỗi)
    ```bash
    docker logs -f restaurant_app
    ```

*   **Dừng ứng dụng:**
    ```bash
    docker-compose down
    ```

*   **Restart ứng dụng:**
    ```bash
    docker-compose restart
    ```

## Cấu hình
Các biến môi trường được cấu hình trong file `.env` và `docker-compose.yml`.
*   Server Port: `4000`
*   Database: `postgres` (User: `postgres`, Pass: `123`)

## Truy cập trang Admin (Quản trị viên)

Module admin đã được kích hoạt. Để truy cập, bạn cần một tài khoản có quyền admin.

1.  **Tạo tài khoản Admin mặc định**
    Chạy lệnh sau để tạo tài khoản admin (nếu chưa có):
    ```bash
    npm run create-admin
    ```
    *Lệnh này sẽ tạo user: `admin@gmail.com` / `admin123`*

2.  **Đăng nhập trang Admin**
    Truy cập: [http://localhost:4000/admin/login](http://localhost:4000/admin/login)
    *   Email: `admin@gmail.com`
    *   Password: `admin123`

3.  **Dashboard**
    Sau khi đăng nhập thành công, bạn sẽ được chuyển đến trang Dashboard quản lý.

