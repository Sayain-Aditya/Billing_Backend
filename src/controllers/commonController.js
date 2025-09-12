const ImageModel = require('../models/common');
const cloudinary = require('../config/cloudinary');


// Upload Images Controller (CloudinaryStorage handles upload)
exports.uploadImages = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const savedImages = await Promise.all(
      files.map(async (file) => {
        const newImage = await ImageModel.create({
          url: file.path,          // already uploaded URL
          public_id: file.filename, // Cloudinary public_id
          name: file.originalname,
        });
        return newImage;
      })
    );

    res.status(201).json({
      message: 'Images uploaded successfully',
      data: savedImages,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Image Controller
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const imageRecord = await ImageModel.findById(id);

    if (!imageRecord) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (imageRecord.public_id) {
      await cloudinary.uploader.destroy(imageRecord.public_id);
    }

    await ImageModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all images
exports.getAllImages = async (req, res) => {
  try {
    const images = await ImageModel.find();
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch images', error: error.message });
  }
};
