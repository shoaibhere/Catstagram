import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faSave, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../store/authStore";

const CreatePostForm = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [croppedImage, setCroppedImage] = useState(null);
  const [isImageCropped, setIsImageCropped] = useState(false);
  const cropperRef = useRef(null);
  const navigate = useNavigate();   
  const { user } = useAuthStore(); 


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setIsImageCropped(false);
        setCroppedImage(null); // Clear previous cropped image
      };
      reader.onerror = () => alert("Failed to load image. Please try again.");
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    try {
      if (cropperRef.current && cropperRef.current.cropper) {
        const canvas = cropperRef.current.cropper.getCroppedCanvas();
        if (!canvas) throw new Error("Cropping failed. Canvas is empty.");
        const croppedData = canvas.toDataURL();
        setCroppedImage(croppedData);
        setIsImageCropped(true);
      } else {
        throw new Error("Cropper not initialized.");
      }
    } catch (err) {
      console.error("Error cropping image:", err.message);
      alert("Error cropping the image. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!croppedImage || !caption.trim()) {
      alert("Please provide both an image and a caption.");
      return;
    }

    const blob = await fetch(croppedImage).then((res) => res.blob());
    const file = new File([blob], "cropped-image.png", { type: "image/png" });

    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("caption", caption);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/posts",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        alert("Post created successfully!");
        navigate("/");
      } else {
        alert("Failed to create post: " + response.data.message);
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("An error occurred while creating the post.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mt-8"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Post
        </h2>

        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          {/* Caption Input */}
          <div className="mb-4">
            <label htmlFor="caption" className="block text-white mb-2">
              Insert Caption
            </label>
            <input
              id="caption"
              type="text"
              placeholder="How are you feeling?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded-md bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label htmlFor="profileImage" className="block text-white mb-2">
              Insert Image
            </label>
            <input
              id="profileImage"
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-400 rounded-md bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            {image && !isImageCropped && (
              <div className="mt-4">
                <Cropper
                  src={image}
                  style={{ width: "100%", height: "auto" }}
                  initialAspectRatio={1}
                  aspectRatio={1}
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

          {caption && croppedImage && (
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6 max-w-xl mx-auto">
              <div className="flex items-center mb-4">
                <img
                  src={
                    user?.profileImage || "https://via.placeholder.com/50"
                  }
                  alt="profile"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h2 className="text-md font-semibold">
                    {user?.name || "User Name"}
                  </h2>
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
              {/* Like, Comment, Save Display */}
              <div className="flex justify-between items-center text-white mt-4">
                {" "}
                <div className="flex items-center">
                  {" "}
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="text-red-500 mr-2"
                  />{" "}
                  <span className="text-gray-400 text-xs">
                    1 Like
                  </span>{" "}
                </div>{" "}
                <div className="flex items-center">
                  {" "}
                  <FontAwesomeIcon
                    icon={faComment}
                    className="text-blue-400 mr-2"
                  />{" "}
                  <span className="text-gray-400 text-xs">
                    {" "}
                    0 Comments
                  </span>{" "}
                </div>{" "}
                <div className="flex items-center">
                {" "}
                <FontAwesomeIcon
                  icon={faBookmark}
                  className="text-green-400 mr-2"
                />{" "}
                <span className="text-gray-400 text-xs">
                  {" "}
                  Save
                </span>{" "}
              </div>{" "}
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`w-full py-3 px-4 bg-green-500 text-white font-bold rounded-lg ${
              !isImageCropped || !caption.trim()
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!isImageCropped || !caption.trim()}
          >
            Create Post
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePostForm;
