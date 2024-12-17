import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faSave,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

const EditPostForm = ({ post }) => {
  const [caption, setCaption] = useState(post.caption || "");
  const [image, setImage] = useState(post.image || null);
  const [newImage, setNewImage] = useState(null); // New uploaded image
  const [croppedImage, setCroppedImage] = useState(image);
  const [isImageCropped, setIsImageCropped] = useState(false);
  const cropperRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(URL.createObjectURL(file));
    setIsImageCropped(false);
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const croppedData = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
      setCroppedImage(croppedData);
      setIsImageCropped(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("caption", caption);

    if (isImageCropped) {
      const blob = await fetch(croppedImage).then((res) => res.blob());
      const file = new File([blob], "cropped-image.png", { type: "image/png" });
      formData.append("profileImage", file);
    }

    try {
      await axios.post(`http://localhost:8000/api/posts/edit/${post._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Post updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    }
  };

  return (
    <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="max-w-lg w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mt-10 mx-auto"
>

      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Edit Post
        </h2>

        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          {/* Caption Input */}
          <div className="mb-4">
            <label htmlFor="caption" className="block text-white mb-2">
              Update Caption
            </label>
            <div className="flex items-center border border-gray-400 rounded-md p-2">
              <input
                id="caption"
                type="text"
                placeholder="Update your caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Upload Image */}
          <div className="mb-6">
            <label htmlFor="profileImage" className="block text-white mb-2">
              Update Image
            </label>
            <div className="flex items-center border border-gray-400 rounded-md p-2">
              <input
                id="profileImage"
                type="file"
                name="profileImage"
                onChange={handleImageChange}
                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
            </div>

            {newImage && !isImageCropped && (
              <div className="mt-4">
                <Cropper
                  src={newImage}
                  style={{ width: "100%", height: "auto" }}
                  initialAspectRatio={1}
                  aspectRatio={1}
                  preview=".img-preview"
                  guides={false}
                  ref={cropperRef}
                />
                <button
                  type="button"
                  onClick={handleCrop}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
                >
                  Crop Image
                </button>
              </div>
            )}
          </div>

          {/* Preview Section */}
          {caption && croppedImage && (
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6 max-w-xl mx-auto">
              <div className="flex items-center mb-4">
                <img
                  src={post.user?.profileImage || "https://via.placeholder.com/50"}
                  alt="profile"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h2 className="text-md font-semibold">{post.user?.name || "User Name"}</h2>
                  <p className="text-sm text-gray-400">{"Just Now"}</p>
                </div>
              </div>

              <div className="mb-4">
                <img
                  src={croppedImage}
                  alt="post"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              <p className="text-sm text-white mb-4">{caption}</p>
              {/* Like, Comment, Save Display */} <div className="flex justify-between items-center text-white mt-4"> <div className="flex items-center"> <FontAwesomeIcon icon={faHeart} className="text-red-500 mr-2" /> <span className="text-gray-400 text-xs"> {post.likes.length === 1 ? "1 Like" : `${post.likes.length} Likes`} </span> </div> <div className="flex items-center"> <FontAwesomeIcon icon={faComment} className="text-blue-400 mr-2" /> <span className="text-gray-400 text-xs"> {post.comments.length === 1 ? "1 Comment" : `${post.comments.length} Comments`} </span> </div> <div className="flex items-center"> <FontAwesomeIcon icon={faSave} className="text-green-400 mr-2" /> <span>Save</span> </div> </div>
            </div>
          )}
          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200`}
            type="submit"
          >
            Edit Post
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default EditPostForm;