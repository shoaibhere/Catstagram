import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const CreatePostForm = ({ user }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [croppedImage, setCroppedImage] = useState(null);
  const [isImageCropped, setIsImageCropped] = useState(false); // Track if the image is cropped
  const cropperRef = useRef(null); // Use useRef to store the cropper reference
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file)); // Display the image preview
    setIsImageCropped(false); // Reset crop status when a new image is selected
    setCroppedImage(null); // Reset cropped image
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper; // Access the cropper instance
      const croppedData = cropper.getCroppedCanvas().toDataURL(); // Get the cropped image as a data URL
      setCroppedImage(croppedData); // Store the cropped image
      setIsImageCropped(true); // Mark the image as cropped
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!croppedImage || !caption.trim()) {
      alert("Please provide both an image and a caption.");
      return;
    }

    // Convert the base64 cropped image to a File object
    const blob = await fetch(croppedImage).then(res => res.blob());
    const file = new File([blob], "cropped-image.png", { type: 'image/png' });

    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("caption", caption);
    formData.append("userId", user._id);

    try {
      const response = await axios.post("http://localhost:8000/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Post
        </h2>

        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="caption" className="block text-white mb-2">
              Insert Caption
            </label>
            <div className="flex items-center border border-gray-400 rounded-md p-2">
              <input
                id="caption"
                type="text"
                placeholder="How are you feeling?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="profileImage" className="block text-white mb-2">
              Insert Image
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

            {image && !isImageCropped && (
              <div className="mt-4">
                <Cropper
                  src={image}
                  style={{ width: '100%', height: 'auto' }}
                  initialAspectRatio={1}
                  aspectRatio={1}
                  preview=".img-preview"
                  guides={false}
                  ref={cropperRef} // Assign the ref here
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
                  src={user.profileImage || 'https://via.placeholder.com/50'}
                  alt="profile"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h2 className="text-md font-semibold">{user.name || 'User Name'}</h2>
                  <p className="text-sm text-gray-400">{'Just Now'}</p>
                </div>
              </div>

              {/* Post Image */}
              <div className="mb-4">
                <img
                  src={croppedImage}
                  alt="post"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Caption */}
              <p className="text-sm text-white mb-4">{caption || 'This is a caption for the post.'}</p>

              {/* Like & Comment Section */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <button className="text-xl text-gray-500 hover:text-red-500 mr-4">
                    {/* Add heart icon here */}
                  </button>
                  <span className="text-gray-400">0 Likes</span>
                </div>
                <div className="flex items-center">
                  <button className="text-xl text-gray-500 hover:text-blue-500 mr-4">
                    {/* Add comment icon here */}
                  </button>
                  <span className="text-gray-400">0 Comments</span>
                </div>
                <button className="text-xl text-gray-500 hover:text-green-500">
                  {/* Add save icon here */}
                </button>
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 ${!isImageCropped || !caption ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={!isImageCropped || !caption} // Disable the button if image is not cropped or caption is empty
          >
            {isImageCropped ? 'Create Post' : 'Crop Image and Post'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePostForm;
