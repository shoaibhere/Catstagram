import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const CreatePostForm = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the post submission logic (e.g., API call)
    // For now, we'll assume the post is created successfully.

    // After posting, redirect to the homepage
    navigate("/"); // Redirect to the homepage ("/")
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

        <form onSubmit={handleSubmit}>
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
            <label htmlFor="imageurl" className="block text-white mb-2">
              Insert Image
            </label>
            <div className="flex items-center border border-gray-400 rounded-md p-2">
              <input
                id="imageurl"
                type="file"
                onChange={handleImageChange}
                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            {image && (
              <div className="mt-4 text-white">
                <p>Selected Image: {image.name}</p>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
          >
            Create Post
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePostForm;
