const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory before uploading to Cloudinary
const upload = multer({ storage });

module.exports = upload;
