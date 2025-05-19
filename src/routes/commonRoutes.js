const express = require('express');
const { uploadImages, deleteImage, getAllImages } = require('../controllers/commonController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/upload-images', uploadMiddleware, uploadImages);
router.delete('/delete/:id', deleteImage);

// ✅ New route to get all images
router.get('/all', getAllImages);

module.exports = router;
