const express = require('express');
const router = express.Router();
const searchController = require('./searchController');

router.get('/results', searchController.renderSearchResultsPage);

module.exports = router;