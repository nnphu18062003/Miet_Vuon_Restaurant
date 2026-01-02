const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// List reviews with filters
router.get('/', reviewController.getReviews);

// Update review status
router.patch('/:id/status', reviewController.updateReviewStatus);

// Delete review
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
