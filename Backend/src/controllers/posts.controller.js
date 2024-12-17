const { Post } = require("../models/posts.model");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a new post
const createPost = async (req, res) => {
  const { caption } = req.body;
  console.log(req.body);  
  const userId = req.userId;
  const imageUrl = req.file.path;// Assuming the user ID is available in the request after authentication

  try {
    if (!imageUrl) {
      throw new Error("Image is required"); // Handle case where file is missing
    }
    // Create a new post
    const newPost = new Post({
      caption,
      image: imageUrl,
      user: userId,
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error in createPost:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const deletePost = async (req,res) =>{
  try{
    await Post.findByIdAndDelete(req.params.id);
    res.status(201).json({
      success: true,
      message: "Post deleted successfully",
    });
  }
  catch(err){
    console.error(err);
    res.status(400).json({ success: false, message: error.message });
  }
};

const editPostget = async(req,res)=>{
  try{
    const post = await Post.findById(req.params.id).populate('user');
    res.status(201).json({
      success: true,
      post,
    });
  }
  catch(err){
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
}

const editPost = async(req,res)=>{
  try{
    const post = await Post.findById(req.params.id);
    if (req.file) {
      post.image = req.file.path;
    }
    post.caption = req.body.caption;
    await post.save();
    res.status(201).json({
      success: true,
      message:"Post Updated Successfully",
    });
  }
  catch(err){
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
}
// Comment on a post
const addComment = async (req, res) => {
  const { postId } = req.params;
  const { commentText } = req.body;
  const userId = req.userId;

  try {
    if (!commentText) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const newComment = {
      user: userId,
      text: commentText,
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      post,
    });
  } catch (error) {
    console.error("Error in addComment:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPost,
  addComment,
  deletePost,
  editPostget,
  editPost,
};
