/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.raw(`
        CREATE TABLE IF NOT EXISTS system_configs (
            config_key VARCHAR(255) PRIMARY KEY,
            config_value TEXT,
            config_group VARCHAR(50) DEFAULT 'general',
            description TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Insert initial default values
        INSERT INTO system_configs (config_key, config_value, config_group, description) VALUES
        ('site_name', 'Miệt Vườn Restaurant', 'general', 'Tên nhà hàng'),
        ('site_phone', '', 'general', 'Số điện thoại liên hệ'),
        ('site_address', '', 'general', 'Địa chỉ nhà hàng'),
        ('bank_code', '', 'payment', 'Mã ngân hàng (VD: MB, VCB)'),
        ('bank_number', '', 'payment', 'Số tài khoản'),
        ('bank_owner', '', 'payment', 'Tên chủ tài khoản'),
        ('payment_template', 'print', 'payment', 'Giao diện QR (print, compact, qr_only)'),
        ('momo_phone', '', 'payment', 'Số điện thoại Momo'),
        ('wifi_ssid', '', 'general', 'Tên Wifi quán'),
        ('wifi_password', '', 'general', 'Mật khẩu Wifi')
        ON CONFLICT (config_key) DO NOTHING;
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('system_configs');
};
