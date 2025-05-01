const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const Post = require('../models/Post');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create a comment
// @route   POST /api/v1/posts/:postId/comments
// @access  Private
exports.createComment = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.post = req.params.postId;

  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.postId}`, 404));
  }

  const comment = await Comment.create(req.body);

  // Create notification for post owner
  if (post.user.toString() !== req.user.id) {
    await Notification.create({
      user: post.user,
      type: 'comment',
      message: `${req.user.name} commented on your post`,
      relatedId: comment._id
    });
  }

  res.status(201).json({
    success: true,
    data: comment
  });
});

// @desc    Get all comments for a post
// @route   GET /api/v1/posts/:postId/comments
// @access  Public
exports.getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate({
      path: 'user',
      select: 'name photo'
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});

// @desc    Update a comment
// @route   PUT /api/v1/comments/:id
// @access  Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is comment owner
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this comment`, 401));
  }

  comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: comment
  });
});

// @desc    Delete a comment
// @route   DELETE /api/v1/comments/:id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is comment owner
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this comment`, 401));
  }

  await comment.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 