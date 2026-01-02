/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.raw(`
        CREATE TABLE IF NOT EXISTS audit_logs (
            log_id SERIAL PRIMARY KEY,
            user_id INT,
            user_email TEXT,
            action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'LOGIN', 'LOGOUT')),
            entity_type TEXT NOT NULL CHECK (entity_type IN ('products', 'orders', 'users', 'categories', 'auth')),
            entity_id INT,
            old_values JSONB,
            new_values JSONB,
            ip_address TEXT,
            user_agent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );
        
        CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
        CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
        CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
        CREATE INDEX idx_audit_logs_action ON audit_logs(action);
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.raw(`DROP TABLE IF EXISTS audit_logs;`);
};
