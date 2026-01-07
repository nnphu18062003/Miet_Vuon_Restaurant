require("dotenv").config();
const pool = require("./config/database");

async function syncCategories() {
  let client;
  try {
    console.log("🔄 Đang đồng bộ categories...\n");

    // Kiểm tra categories hiện tại
    const current = await pool.query(`SELECT category_id, name FROM categories ORDER BY category_id`);
    console.log("📋 Categories hiện tại trong database:");
    if (current.rows.length === 0) {
      console.log("   (Không có dữ liệu)\n");
    } else {
      current.rows.forEach(row => {
        console.log(`   ${row.category_id}. ${row.name}`);
      });
      console.log();
    }

    // Xóa products trước (để tránh foreign key constraint)
    console.log("🗑️  Đang xóa products cũ...");
    await pool.query(`DELETE FROM products`);
    console.log("✅ Đã xóa products\n");

    // Xóa categories cũ
    console.log("🗑️  Đang xóa categories cũ...");
    await pool.query(`DELETE FROM categories`);
    console.log("✅ Đã xóa categories cũ\n");

    // Thêm categories mới
    console.log("➕ Đang thêm categories mới...");
    await pool.query(`
      INSERT INTO categories (category_id, name) VALUES
      (1, 'Khai Vị'),
      (2, 'Món chính'),
      (3, 'Món phụ'),
      (4, 'Đồ uống')
    `);
    console.log("✅ Đã thêm categories mới\n");

    // Kiểm tra lại
    const result = await pool.query(`SELECT category_id, name FROM categories ORDER BY category_id`);
    console.log("✅ Categories mới trong database:");
    result.rows.forEach(row => {
      console.log(`   ${row.category_id}. ${row.name}`);
    });

    console.log("\n📝 Bước tiếp theo:");
    console.log("   1. Chạy: npx knex seed:run");
    console.log("   2. Restart server (Ctrl+C và chạy lại node server.js)");
    console.log("   3. Refresh trang web (Ctrl+Shift+R hoặc Cmd+Shift+R)");

  } catch (error) {
    console.error("\n❌ Lỗi:", error.message);
    if (error.stack) {
      console.error("Stack:", error.stack);
    }
  } finally {
    await pool.end();
    console.log("\n🔌 Đã đóng kết nối database");
  }
}

syncCategories();

