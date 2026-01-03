# Hướng dẫn Cấu hình Đăng nhập Google & Gửi Email

Để tính năng Đăng nhập bằng Google và Gửi email xác thực hoạt động, bạn cần lấy các khóa bí mật từ Google. Dưới đây là hướng dẫn chi tiết.

## 1. Cấu hình Email (Gmail App Password)

Mật khẩu ứng dụng (App Password) cho phép ứng dụng của chúng ta gửi email thông qua tài khoản Gmail của bạn một cách an toàn mà **không cần mật khẩu gốc**.

### Bước 1: Bật Xác thực 2 bước (2-Step Verification)
1. Truy cập [Google Account Security](https://myaccount.google.com/security).
2. Tìm mục **"How you sign in to Google"** (Cách bạn đăng nhập vào Google).
3. Chọn **"2-Step Verification"** (Xác minh 2 bước) và làm theo hướng dẫn để bật nó lên (nếu chưa bật).

### Bước 2: Tạo Mật khẩu ứng dụng
1. Sau khi bật xác thực 2 bước, quay lại trang [Security](https://myaccount.google.com/security).
2. Tìm kiếm **"App passwords"** (Mật khẩu ứng dụng) trong ô tìm kiếm ở đầu trang, hoặc truy cập trực tiếp link: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. Đặt tên cho ứng dụng (ví dụ: `MietVuonWebsite`).
4. Nhấn **Create** (Tạo).
5. Google sẽ hiện ra một chuỗi ký tự 16 chữ cái (ví dụ: `abcd efgh ijkl mnop`).
6. **Copy chuỗi này** (bỏ các khoảng trắng nếu có) và dán vào file `.env` mục `EMAIL_PASS`.

```env
EMAIL_USER=dia_chi_email_cua_ban@gmail.com
EMAIL_PASS=mat_khau_16_ky_tu_vua_tao
```

---

## 2. Cấu hình Google Login (OAuth Client ID)

### Bước 1: Tạo Project trên Google Cloud
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Nhấn vào danh sách Project ở góc trên bên trái -> **New Project**.
3. Đặt tên (ví dụ: `Miet Vuon Auth`) -> **Create**.

### Bước 2: Cấu hình OAuth Consent Screen
1. Trong menu bên trái, chọn **APIs & Services** -> **OAuth consent screen**.
2. Chọn **External** -> **Create**.
3. Điền thông tin:
   - **App name**: Miet Vuon Restaurant
   - **User support email**: Email của bạn
   - **Developer contact information**: Email của bạn
4. Nhấn **Save and Continue** liên tục cho đến khi hoàn tất.

### Bước 3: Tạo Credentials
1. Vào mục **Credentials** (bên trái).
2. Nhấn **+ CREATE CREDENTIALS** -> **OAuth client ID**.
3. Chọn **Application type**: **Web application**.
4. Điền thông tin:
   - **Name**: Web Client 1 (hoặc tên tùy ý)
   - **Authorized JavaScript origins**: `http://localhost:4000`
   - **Authorized redirect URIs**: `http://localhost:4000/auth/google/callback`
     *(Lưu ý: Link này phải khớp chính xác với code trong `passport_google.js`)*.
5. Nhấn **Create**.
6. Google sẽ hiện bảng chứa **Your Client ID** và **Your Client Secret**.

### Bước 4: Cập nhật file .env
Copy 2 giá trị trên vào file `.env`:

```env
GOOGLE_CLIENT_ID=dan_client_id_vao_day
GOOGLE_CLIENT_SECRET=dan_client_secret_vao_day
```

## 3. BASE_URL là gì?

`BASE_URL` là địa chỉ gốc của trang web, dùng để tạo đường dẫn trong email xác thực (ví dụ: link bấm vào để kích hoạt tài khoản).

- Khi chạy trên máy tính cá nhân (Local): `http://localhost:4000`
- Khi đưa lên mạng (Deploy): Đổi thành tên miền thật, ví dụ `https://nhahangmietvuon.com`
