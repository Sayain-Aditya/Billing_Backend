const express = require('express');
const { uploadImages, deleteImage, getAllImages } = require('../controllers/commonController');
const upload = require('../middleware/uploadMiddleware');  // Cloudinary multer middleware

const router = express.Router();

// ✅ Upload images to Cloudinary
router.post('/upload-images', upload.array('images', 10), uploadImages);

// ✅ Delete image from Cloudinary
router.delete('/delete/:id', deleteImage);

// ✅ Get all uploaded images (Cloudinary fetch/list)
router.get('/all', getAllImages);

module.exports = router;
