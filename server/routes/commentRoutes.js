const express = require('express');
const router = express.Router({ mergeParams: true }); // To access params from parent router
const { protect } = require('../middleware/auth');
const {
  createComment,
  getNGOComments,
  updateComment,
  deleteComment,
  getUserComments
} = require('../controllers/commentController');

// Public routes
router.get('/ngo/:ngoId', getNGOComments);

// Protected routes
router.use(protect);
router.post('/ngo/:ngoId', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);
router.get('/user', getUserComments);

module.exports = router; 