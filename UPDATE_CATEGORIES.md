# Hướng Dẫn Cập Nhật Categories

## ⚡ CÁCH NHANH NHẤT

Mở terminal trong thư mục project và chạy lần lượt các lệnh sau:

### Bước 1: Cập nhật categories trong database
```bash
node syncCategories.js
```

### Bước 2: Thêm lại products
```bash
npx knex seed:run
```

### Bước 3: Restart server
- Nhấn `Ctrl+C` để dừng server (nếu đang chạy)
- Chạy lại: `node server.js` hoặc `npm run dev`

### Bước 4: Clear cache và refresh trang
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`
- Hoặc mở cửa sổ ẩn danh (Incognito)

---

## 🔍 KIỂM TRA

Sau khi chạy các lệnh trên, filter sẽ hiển thị:
- ✅ Khai Vị
- ✅ Món chính
- ✅ Món phụ
- ✅ Đồ uống

Thay vì các danh mục cũ (Burger, Pizza, Gà Rán, Đồ Ăn Nhẹ, Đồ Uống).

---

## ❓ NẾU VẪN KHÔNG THẤY THAY ĐỔI

1. **Kiểm tra database đã được cập nhật chưa:**
   ```bash
   node -e "const pool = require('./config/database'); pool.query('SELECT name FROM categories ORDER BY category_id').then(r => { console.log('Categories:', r.rows.map(x => x.name).join(', ')); pool.end(); });"
   ```

2. **Kiểm tra server có đang chạy không:**
   - Xem terminal có log "Server is running on port: http://localhost:4000" không

3. **Kiểm tra console browser (F12):**
   - Xem có lỗi gì không
   - Kiểm tra tab Network xem request có thành công không

4. **Thử truy cập trực tiếp API:**
   - Mở: `http://localhost:4000/category` trong browser
   - Xem có hiển thị đúng không

---

## 📝 LƯU Ý

- Script `syncCategories.js` sẽ **XÓA TẤT CẢ** products và categories cũ
- Sau đó sẽ thêm lại categories mới
- Bạn cần chạy `npx knex seed:run` để thêm lại products



