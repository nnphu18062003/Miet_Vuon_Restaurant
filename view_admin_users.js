require("dotenv").config();
const knexConfig = require('./knexfile.js');
const knexConstructor = require('knex');

const environment = process.env.NODE_ENV || "development";
// Fix port to be a number
if (knexConfig[environment].connection && knexConfig[environment].connection.port) {
    knexConfig[environment].connection.port = parseInt(knexConfig[environment].connection.port) || 5432;
}
const knex = knexConstructor(knexConfig[environment]);

async function viewAdminUsers() {
    try {
        console.log("\n=== DANH SÁCH TÀI KHOẢN ADMIN ===\n");
        
        // Lấy tất cả user có role = false (admin)
        const adminUsers = await knex('users')
            .where('role', false)
            .select('id', 'name', 'email', 'phone', 'create_at', 'update_at')
            .orderBy('id', 'asc');
        
        if (adminUsers.length === 0) {
            console.log("❌ Không có tài khoản admin nào trong database.");
            console.log("\n💡 Bạn có thể tạo tài khoản admin bằng cách chạy:");
            console.log("   node create_admin_user.js\n");
        } else {
            console.log(`✅ Tìm thấy ${adminUsers.length} tài khoản admin:\n`);
            
            adminUsers.forEach((user, index) => {
                console.log(`${index + 1}. ID: ${user.id}`);
                console.log(`   Tên: ${user.name || 'N/A'}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Số điện thoại: ${user.phone || 'N/A'}`);
                console.log(`   Ngày tạo: ${user.create_at ? new Date(user.create_at).toLocaleString('vi-VN') : 'N/A'}`);
                console.log(`   Cập nhật: ${user.update_at ? new Date(user.update_at).toLocaleString('vi-VN') : 'N/A'}`);
                console.log('');
            });
        }
        
        // Hiển thị thêm thông tin về tài khoản customer (role = true)
        const customerCount = await knex('users').where('role', true).count('* as count').first();
        console.log(`📊 Tổng số tài khoản customer: ${customerCount?.count || 0}`);
        
    } catch (error) {
        console.error("❌ Lỗi khi truy vấn database:", error);
    } finally {
        await knex.destroy();
    }
}

viewAdminUsers();

