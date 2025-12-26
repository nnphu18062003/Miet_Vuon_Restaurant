# Hướng Dẫn Cập Nhật Database

## ⚠️ LƯU Ý QUAN TRỌNG

**Trước khi cập nhật database, hãy đảm bảo:**
- ✅ Đã backup database (nếu có dữ liệu quan trọng)
- ✅ Đã kiểm tra các thay đổi trong migrations
- ✅ Đã kiểm tra các thay đổi trong seeds

---

## 📋 CÁC TÌNH HUỐNG CẬP NHẬT

### **Tình huống 1: Database mới / Development (Không có dữ liệu quan trọng)**

Nếu bạn đang ở môi trường development và không có dữ liệu quan trọng, có thể reset toàn bộ:

```bash
# Bước 1: Rollback tất cả migrations
npx knex migrate:rollback --all

# Bước 2: Chạy lại tất cả migrations với schema mới
npx knex migrate:latest

# Bước 3: Chạy lại seeds để insert dữ liệu mẫu
npx knex seed:run
```

**Hoặc sử dụng script có sẵn:**
```bash
npm run setup-db:dev
```

---

### **Tình huống 2: Database đã có dữ liệu (Cần giữ lại dữ liệu)**

Nếu database đã có dữ liệu quan trọng (users, orders, etc.), cần cập nhật cẩn thận:

#### **Option A: Chỉ cập nhật schema (giữ nguyên dữ liệu)**

Vì các migrations đã được sửa, bạn cần tạo migration mới để ALTER các bảng:

```bash
# Tạo migration mới để sửa các cột
npx knex migrate:make fix_column_names

# Sau đó chạy migration mới
npx knex migrate:latest
```

**Nội dung migration mới cần có:**
```javascript
// Sửa bảng categories
ALTER TABLE categories RENAME COLUMN "Category_Id" TO category_id;
ALTER TABLE categories RENAME COLUMN "Name" TO name;

// Sửa bảng products  
ALTER TABLE products RENAME COLUMN "product_Url" TO product_url;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_id_foreign;
ALTER TABLE products ADD CONSTRAINT products_category_id_foreign 
  FOREIGN KEY (category_id) REFERENCES categories(category_id);

// Sửa bảng users
ALTER TABLE users RENAME COLUMN create_at TO created_at;
ALTER TABLE users RENAME COLUMN update_at TO updated_at;
ALTER TABLE users ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

// Sửa bảng carts
ALTER TABLE carts RENAME COLUMN "create_At" TO created_at;
ALTER TABLE carts ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
```

#### **Option B: Cập nhật dữ liệu product_url**

Nếu chỉ cần sửa product_url:
```bash
# Tạo script update
node -e "
const pool = require('./config/database');
pool.query(\"UPDATE products SET product_url = '/menu/1.jpg' WHERE product_url LIKE '%/public/menu/1.jpg' OR product_url LIKE '%/Users/%'\").then(() => {
  console.log('Updated!');
  pool.end();
});
"
```

---

### **Tình huống 3: Production (Môi trường sản xuất)**

⚠️ **CỰC KỲ CẨN THẬN** - Phải backup trước!

```bash
# Bước 1: Backup database
pg_dump -h $DB_HOST -U $DB_USERNAME -d $DB_NAME > backup_$(date +%Y%m%d_%H%M%S).sql

# Bước 2: Chạy migration mới (nếu có)
NODE_ENV=PROD npx knex migrate:latest

# Bước 3: Kiểm tra kết quả
NODE_ENV=PROD npx knex migrate:status
```

---

## 🔧 CÁC LỆNH KNEX THƯỜNG DÙNG

### **Kiểm tra trạng thái migrations:**
```bash
npx knex migrate:status
```

### **Xem danh sách migrations đã chạy:**
```bash
npx knex migrate:list
```

### **Rollback migration gần nhất:**
```bash
npx knex migrate:rollback
```

### **Rollback tất cả migrations:**
```bash
npx knex migrate:rollback --all
```

### **Chạy migrations chưa chạy:**
```bash
npx knex migrate:latest
```

### **Chạy tất cả seeds:**
```bash
npx knex seed:run
```

### **Chạy seed cụ thể:**
```bash
npx knex seed:run --specific=products.js
```

---

## 📝 CÁC THAY ĐỔI ĐÃ THỰC HIỆN

### **1. Bảng `categories`:**
- ✅ `Category_Id` → `category_id`
- ✅ `Name` → `name`

### **2. Bảng `products`:**
- ✅ `product_Url` → `product_url`
- ✅ Foreign key: `Categories(category_id)` → `categories(category_id)`

### **3. Bảng `users`:**
- ✅ `create_at` → `created_at`
- ✅ `update_at` → `updated_at`
- ✅ Thêm DEFAULT CURRENT_TIMESTAMP

### **4. Bảng `carts`:**
- ✅ `create_At` → `created_at`
- ✅ Thêm DEFAULT CURRENT_TIMESTAMP

### **5. File `seeds/products.js`:**
- ✅ `product_url`: `/Users/.../public/menu/1.jpg` → `/menu/1.jpg`

---

## 🚀 QUY TRÌNH KHUYẾN NGHỊ

### **Cho Development:**
1. Backup dữ liệu (nếu cần)
2. Rollback tất cả: `npx knex migrate:rollback --all`
3. Chạy migrations mới: `npx knex migrate:latest`
4. Chạy seeds: `npx knex seed:run`
5. Kiểm tra kết quả

### **Cho Production:**
1. **BACKUP DATABASE** (bắt buộc!)
2. Test trên staging trước
3. Tạo migration mới để ALTER (không rollback)
4. Chạy migration: `NODE_ENV=PROD npx knex migrate:latest`
5. Kiểm tra và test kỹ
6. Cập nhật product_url nếu cần

---

## ⚡ QUICK START (Development)

Nếu bạn đang ở development và muốn reset nhanh:

```bash
# Reset toàn bộ và setup lại
npm run setup-db:dev

# Hoặc từng bước:
npx knex migrate:rollback --all
npx knex migrate:latest  
npx knex seed:run
```

---

## ❓ TROUBLESHOOTING

### **Lỗi: "relation already exists"**
→ Bảng đã tồn tại, cần rollback trước hoặc dùng ALTER TABLE

### **Lỗi: "foreign key constraint"**
→ Kiểm tra thứ tự xóa dữ liệu (xóa bảng con trước)

### **Lỗi: "column does not exist"**
→ Cột đã bị đổi tên, cần update code hoặc migration

### **Migration không chạy**
→ Kiểm tra `knex_migrations` table xem migration đã được đánh dấu chưa

---

## 📞 CẦN HỖ TRỢ?

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs lỗi
2. Kiểm tra `npx knex migrate:status`
3. Kiểm tra database connection trong `.env`

