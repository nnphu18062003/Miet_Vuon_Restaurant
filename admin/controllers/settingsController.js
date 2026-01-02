const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);
const auditLogger = require('../../services/auditLogger');

/**
 * Get all system settings
 */
exports.getSettings = async (req, res) => {
    try {
        const configs = await knex('system_configs').select('*');

        // Convert array to object for easier access in view
        const settings = {};
        configs.forEach(conf => {
            settings[conf.config_key] = conf.config_value;
        });

        res.render('admin_views/admin_settings_new', {
            settings,
            currentPage: 'settings',
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Get Settings Error:', error);
        res.render('admin_views/admin_settings_new', {
            settings: {},
            currentPage: 'settings',
            success: req.flash('success'),
            error: req.flash('error')
        });
    }
};

/**
 * Update system settings
 */
exports.updateSettings = async (req, res) => {
    try {
        const updates = req.body;
        const userId = req.user.id;
        const userEmail = req.user.email;

        // Filter out csrf or other non-config fields if any (though body should be clean)
        // We iterate over keys and update if they exist in DB (or upsert)

        // Allowed keys to prevent pollution
        const allowedKeys = [
            'site_name', 'site_phone', 'site_address',
            'bank_code', 'bank_number', 'bank_owner', 'payment_template',
            'momo_phone', 'wifi_ssid', 'wifi_password'
        ];

        const oldSettings = await knex('system_configs').select('*');
        const oldSettingsMap = {};
        oldSettings.forEach(conf => {
            oldSettingsMap[conf.config_key] = conf.config_value;
        });

        const changes = {};

        for (const key of Object.keys(updates)) {
            if (allowedKeys.includes(key)) {
                await knex('system_configs')
                    .insert({ config_key: key, config_value: updates[key] })
                    .onConflict('config_key')
                    .merge();

                if (oldSettingsMap[key] !== updates[key]) {
                    changes[key] = { from: oldSettingsMap[key], to: updates[key] };
                }
            }
        }

        // Audit log if changes made
        if (Object.keys(changes).length > 0) {
            await auditLogger.logUpdate(
                userId,
                userEmail,
                'system_configs',
                0, // No specific ID for global config, or use 0
                { changes: Object.keys(changes) }, // Summarize what changed
                changes,
                req.ip,
                req.get('user-agent')
            );
        }

        req.flash('success', 'Cập nhật cài đặt thành công!');
        res.redirect('/admin/settings');
    } catch (error) {
        console.error('Update Settings Error:', error);
        req.flash('error', 'Lỗi khi cập nhật cài đặt');
        res.redirect('/admin/settings');
    }
};
