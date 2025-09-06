const ImageModel = require('../models/common');
const cloudinary = require('../config/cloudinary');

// ✅ Upload Images to Cloudinary
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      // Upload file buffer to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'uploads',
      });

      const newImage = await ImageModel.create({
        url: result.secure_url,
        public_id: result.public_id, // store for delete reference
        name: file.originalname,
      });

      uploadedImages.push(newImage);
    }

    res.status(201).json({
      message: 'Images uploaded successfully',
      data: uploadedImages,
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Delete Image from Cloudinary
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const imageRecord = await ImageModel.findById(id);
    if (!imageRecord) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(imageRecord.public_id);

    // Delete from DB
    await ImageModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Get all Images from DB
exports.getAllImages = async (req, res) => {
  try {
    const images = await ImageModel.find();
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch images', error: error.message });
  }
};
