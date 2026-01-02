const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// Get settings page
router.get('/', settingsController.getSettings);

// Update settings
router.post('/update', settingsController.updateSettings);

module.exports = router;
