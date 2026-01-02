const express = require('express');
const router = express.Router();
const auditLogger = require('../../services/auditLogger');

/**
 * GET /admin/audit-logs/:id
 * View single audit log detail
 * MUST BE BEFORE the '/' route to avoid conflict
 */
router.get('/:id(\\d+)', async (req, res) => {
    try {
        const log = await auditLogger.getLogById(req.params.id);
        if (!log) {
            return res.status(404).json({ error: 'Log not found' });
        }
        res.json(log);
    } catch (error) {
        console.error('Get Audit Log Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * GET /admin/audit-logs
 * Display audit logs with pagination and filters
 */
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;

        // Build filters from query params
        const filters = {};
        if (req.query.action) filters.action = req.query.action;
        if (req.query.entityType) filters.entityType = req.query.entityType;
        if (req.query.userId) filters.userId = parseInt(req.query.userId);
        if (req.query.startDate) filters.startDate = req.query.startDate;
        if (req.query.endDate) filters.endDate = req.query.endDate;

        const result = await auditLogger.getLogs(filters, page, limit);

        res.render('admin_views/admin_audit_logs_new', {
            logs: result.logs,
            pagination: {
                page: result.page,
                totalPages: result.totalPages,
                hasNext: result.page < result.totalPages,
                hasPrev: result.page > 1,
                total: result.total
            },
            filters: req.query,
            currentPage: 'audit'
        });
    } catch (error) {
        console.error('Audit Logs Page Error:', error);
        res.render('admin_views/admin_audit_logs_new', {
            logs: [],
            pagination: { page: 1, totalPages: 0, hasNext: false, hasPrev: false, total: 0 },
            filters: {},
            currentPage: 'audit'
        });
    }
});

module.exports = router;
