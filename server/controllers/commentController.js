const Comment = require('../models/Comment');
const NGO = require('../models/NGO');
const { validateComment } = require('../utils/validators');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { error } = validateComment(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if NGO exists
    const ngo = await NGO.findById(req.params.ngoId);
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }

    const comment = new Comment({
      content: req.body.content,
      rating: req.body.rating,
      ngo: req.params.ngoId,
      user: req.user._id
    });

    await comment.save();

    // Populate user details
    await comment.populate('user', 'name email');

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating comment',
      error: err.message
    });
  }
};

// Get comments for an NGO
exports.getNGOComments = async (req, res) => {
  try {
    const comments = await Comment.find({ ngo: req.params.ngoId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: err.message
    });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { error } = validateComment(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { 
        content: req.body.content,
        rating: req.body.rating,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating comment',
      error: err.message
    });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: err.message
    });
  }
};

// Get user's comments
exports.getUserComments = async (req, res) => {
  try {
    const comments = await Comment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('ngo', 'name photo');

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user comments',
      error: err.message
    });
  }
}; 