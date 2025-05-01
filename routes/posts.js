const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getPosts)
  .post(protect, authorize('admin'), createPost);

router.route('/:id')
  .get(getPost)
  .put(protect, authorize('admin'), updatePost)
  .delete(protect, authorize('admin'), deletePost);

module.exports = router; 