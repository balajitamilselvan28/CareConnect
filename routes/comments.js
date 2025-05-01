const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const commentController = require('../controllers/commentController');
const { commentValidation } = require('../middleware/validator');

// Create a comment
router.post('/:postId', protect, commentValidation.create, commentController.createComment);

// Get all comments for a post
router.get('/:postId', commentController.getComments);

// Update a comment
router.put('/:id', protect, commentValidation.update, commentController.updateComment);

// Delete a comment
router.delete('/:id', protect, commentController.deleteComment);

module.exports = router; 