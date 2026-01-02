const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

/**
 * Audit Logger Service
 * Centralized service for logging all user actions in the system
 */
class AuditLogger {
    /**
     * Log a CREATE action
     * @param {number} userId - ID of user performing action
     * @param {string} userEmail - Email of user
     * @param {string} entityType - Type of entity (products, orders, users, etc.)
     * @param {number} entityId - ID of created entity
     * @param {object} newValues - New entity data
     * @param {string} ipAddress - IP address of request
     * @param {string} userAgent - User agent string
     */
    async logCreate(userId, userEmail, entityType, entityId, newValues, ipAddress = null, userAgent = null) {
        try {
            await knex('audit_logs').insert({
                user_id: userId,
                user_email: userEmail,
                action: 'CREATE',
                entity_type: entityType,
                entity_id: entityId,
                new_values: JSON.stringify(newValues),
                ip_address: ipAddress,
                user_agent: userAgent
            });
        } catch (error) {
            console.error('Audit Log Error (CREATE):', error);
            // Don't throw - audit logging should never break the main flow
        }
    }

    /**
     * Log an UPDATE action
     * @param {number} userId - ID of user performing action
     * @param {string} userEmail - Email of user
     * @param {string} entityType - Type of entity
     * @param {number} entityId - ID of updated entity
     * @param {object} oldValues - Previous entity data
     * @param {object} newValues - New entity data
     * @param {string} ipAddress - IP address
     * @param {string} userAgent - User agent
     */
    async logUpdate(userId, userEmail, entityType, entityId, oldValues, newValues, ipAddress = null, userAgent = null) {
        try {
            await knex('audit_logs').insert({
                user_id: userId,
                user_email: userEmail,
                action: 'UPDATE',
                entity_type: entityType,
                entity_id: entityId,
                old_values: JSON.stringify(oldValues),
                new_values: JSON.stringify(newValues),
                ip_address: ipAddress,
                user_agent: userAgent
            });
        } catch (error) {
            console.error('Audit Log Error (UPDATE):', error);
        }
    }

    /**
     * Log a DELETE action
     * @param {number} userId - ID of user performing action
     * @param {string} userEmail - Email of user
     * @param {string} entityType - Type of entity
     * @param {number} entityId - ID of deleted entity
     * @param {object} oldValues - Deleted entity data
     * @param {string} ipAddress - IP address
     * @param {string} userAgent - User agent
     */
    async logDelete(userId, userEmail, entityType, entityId, oldValues, ipAddress = null, userAgent = null) {
        try {
            await knex('audit_logs').insert({
                user_id: userId,
                user_email: userEmail,
                action: 'DELETE',
                entity_type: entityType,
                entity_id: entityId,
                old_values: JSON.stringify(oldValues),
                ip_address: ipAddress,
                user_agent: userAgent
            });
        } catch (error) {
            console.error('Audit Log Error (DELETE):', error);
        }
    }

    /**
     * Log a STATUS_CHANGE action (for orders, products, etc.)
     * @param {number} userId - ID of user performing action
     * @param {string} userEmail - Email of user
     * @param {string} entityType - Type of entity
     * @param {number} entityId - ID of entity
     * @param {string} oldStatus - Previous status
     * @param {string} newStatus - New status
     * @param {string} ipAddress - IP address
     * @param {string} userAgent - User agent
     */
    async logStatusChange(userId, userEmail, entityType, entityId, oldStatus, newStatus, ipAddress = null, userAgent = null) {
        try {
            await knex('audit_logs').insert({
                user_id: userId,
                user_email: userEmail,
                action: 'STATUS_CHANGE',
                entity_type: entityType,
                entity_id: entityId,
                old_values: JSON.stringify({ status: oldStatus }),
                new_values: JSON.stringify({ status: newStatus }),
                ip_address: ipAddress,
                user_agent: userAgent
            });
        } catch (error) {
            console.error('Audit Log Error (STATUS_CHANGE):', error);
        }
    }

    /**
     * Log authentication events
     * @param {number} userId - ID of user
     * @param {string} userEmail - Email of user
     * @param {string} action - LOGIN or LOGOUT
     * @param {string} ipAddress - IP address
     * @param {string} userAgent - User agent
     */
    async logAuth(userId, userEmail, action, ipAddress = null, userAgent = null) {
        try {
            await knex('audit_logs').insert({
                user_id: userId,
                user_email: userEmail,
                action: action, // 'LOGIN' or 'LOGOUT'
                entity_type: 'auth',
                ip_address: ipAddress,
                user_agent: userAgent
            });
        } catch (error) {
            console.error('Audit Log Error (AUTH):', error);
        }
    }

    /**
     * Get audit logs with pagination and filters
     * @param {object} filters - Filter options
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Promise<{logs: Array, total: number, page: number, totalPages: number}>}
     */
    async getLogs(filters = {}, page = 1, limit = 50) {
        try {
            let query = knex('audit_logs');

            // Apply filters
            if (filters.userId) {
                query = query.where('user_id', filters.userId);
            }
            if (filters.action) {
                query = query.where('action', filters.action);
            }
            if (filters.entityType) {
                query = query.where('entity_type', filters.entityType);
            }
            if (filters.entityId) {
                query = query.where('entity_id', filters.entityId);
            }
            if (filters.startDate) {
                query = query.where('created_at', '>=', filters.startDate);
            }
            if (filters.endDate) {
                query = query.where('created_at', '<=', filters.endDate);
            }

            // Get total count - use a separate simple query
            const countResult = await knex('audit_logs').count('log_id as count').first();
            const total = parseInt(countResult?.count || 0);

            // Get paginated logs
            const offset = (page - 1) * limit;
            const logs = await query
                .select('*')
                .orderBy('created_at', 'desc')
                .limit(limit)
                .offset(offset);

            return {
                logs,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            console.error('Get Audit Logs Error:', error);
            return { logs: [], total: 0, page: 1, totalPages: 0 };
        }
    }

    /**
     * Get a single audit log by ID
     * @param {number} logId - Log ID
     * @returns {Promise<object|null>}
     */
    async getLogById(logId) {
        try {
            return await knex('audit_logs')
                .where('log_id', logId)
                .first();
        } catch (error) {
            console.error('Get Audit Log Error:', error);
            return null;
        }
    }
}

module.exports = new AuditLogger();
