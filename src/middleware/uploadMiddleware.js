// middleware/uploadMiddleware.js
const multer = require('multer');

// Configure storage using memoryStorage to store files in memory temporarily
const storage = multer.memoryStorage();

// Define the multer upload middleware (handles up to 10 files at a time)
const upload = multer({
  storage: storage,
limits: { fileSize: 0.5 * 1024 * 1024 },  // 500KB limit for each file

}).array('images', 20);  // 'images' is the field name in the form, and 10 is the maximum number of files

// Middleware export for usage in routes
module.exports = upload;
