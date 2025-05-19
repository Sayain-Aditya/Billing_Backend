const express = require('express');
const { storage, ref, uploadBytes, getDownloadURL, deleteObject } = require('../utils/firebase');
const ImageModel = require('../models/common');

// Upload Images Controller
exports.uploadImages = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const savedImages = [];

    for (const file of files) {
      const fileRef = ref(storage, `images/commons/${file.originalname}`);
      await uploadBytes(fileRef, file.buffer);
      const url = await getDownloadURL(fileRef);

      const newImage = await ImageModel.create({
        url,
        name: file.originalname, // ✅ Store name
      });}

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

    const imageName = imageRecord.name; // ✅ use this instead of extracting from URL
    const fileRef = ref(storage, `images/commons/${imageName}`);
    await deleteObject(fileRef);

    await ImageModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const images = await ImageModel.find(); // Or .find().sort({ createdAt: -1 }) if you want latest first
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch images', error: error.message });
  }
};