const { Post } = require("../models/posts.model");
const { Comment } = require("../models/comments.model");

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { userId, postId } = req.params;

    if (!text) { // Validation for text field
      return res.status(400).json({ message: "Text field is required" });
    }

    const comment = new Comment({
      text,
      user: userId
    });

    await comment.save();

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push(comment);
    await post.save();
    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const removeComment= async (req,res)=>{
  try{
    const{ commentId,userId } = req.params;

    const comment  = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if(comment.user._id.toString()!==userId){
       res.status(500).json({ message: "You are not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
};

const editComment= async (req,res)=>{
  try{
    const{ commentId,userId } = req.params;
    const{text} = req.body;

    const comment  = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if(comment.user._id.toString()!==userId){
       res.status(500).json({ message: "You are not authorized to edit this comment" });
    }

    comment.text = text;
    await comment.save();
    res.status(200).json({ message: "Comment updated successfully" });
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post and populate the comments
    const post = await Post.findById(postId).populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name profileImage'  // Correctly formatted
      }
    });
    

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Extract comments from the post
    const comments = post.comments;

    res.status(200).json({
      success: true,
      comments: comments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOneComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Retrieve the comment and populate the user details
    const comment = await Comment.findById(commentId).populate('user', 'name'); // Adjust fields as needed

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({
      success: true,
      comment: comment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getOneComment,
  getComments,
  addComment,
  removeComment,
  editComment,
};
