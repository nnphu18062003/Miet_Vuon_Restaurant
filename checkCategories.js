require("dotenv").config();
const pool = require("./config/database");

async function checkCategories() {
  try {
    console.log("🔍 Đang kiểm tra categories trong database...\n");
    
    const result = await pool.query(`
      SELECT category_id, name 
      FROM categories 
      ORDER BY category_id
    `);
    
    if (result.rows.length === 0) {
      console.log("❌ KHÔNG CÓ CATEGORIES TRONG DATABASE!");
      console.log("\n📝 Chạy lệnh sau để thêm categories:");
      console.log("   node syncCategories.js");
      console.log("   npx knex seed:run");
    } else {
      console.log("✅ Categories hiện tại trong database:");
      result.rows.forEach(row => {
        console.log(`   ${row.category_id}. ${row.name}`);
      });
      
      const expected = ['Khai Vị', 'Món chính', 'Món phụ', 'Đồ uống'];
      const current = result.rows.map(r => r.name);
      
      const isMatch = expected.length === current.length && 
        expected.every((val, idx) => val === current[idx]);
      
      if (isMatch) {
        console.log("\n✅ Database đã có categories đúng!");
        console.log("\n⚠️  Nếu UI vẫn chưa hiển thị, hãy:");
        console.log("   1. Restart server (Ctrl+C và chạy lại node server.js)");
        console.log("   2. Clear browser cache (Ctrl+Shift+R hoặc Cmd+Shift+R)");
        console.log("   3. Kiểm tra console browser (F12) xem có lỗi không");
      } else {
        console.log("\n❌ Categories chưa đúng!");
        console.log("   Cần cập nhật database.");
        console.log("\n📝 Chạy lệnh sau:");
        console.log("   node syncCategories.js");
        console.log("   npx knex seed:run");
      }
    }
    
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    console.error("\n💡 Kiểm tra:");
    console.error("   - File .env có đúng không?");
    console.error("   - Database có đang chạy không?");
    console.error("   - Connection string có đúng không?");
  } finally {
    await pool.end();
  }
}

checkCategories();



