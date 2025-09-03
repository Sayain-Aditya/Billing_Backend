const express = require('express');
const ImageModel = require('../models/common');
const path = require('path');
const fs = require('fs');

// Upload Images Controller (using local storage)
exports.uploadImages = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const savedImages = [];

    for (const file of files) {
      // Save file locally
      const fileName = Date.now() + '-' + file.originalname;
      const filePath = path.join(__dirname, '../../uploads', fileName);
      
      // Ensure uploads directory exists
      const uploadsDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, file.buffer);
      
      const newImage = await ImageModel.create({
        url: `/uploads/${fileName}`,
        name: file.originalname,
      });
      
      savedImages.push(newImage);
    }

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

    // Delete local file
    const filePath = path.join(__dirname, '../../', imageRecord.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await ImageModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const images = await ImageModel.find();
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch images', error: error.message });
  }
};