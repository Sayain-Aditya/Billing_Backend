const express = require("express");
const {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("../utils/firebase");
const DestinationModel = require("../models/destination"); // ✅ Model for destinations
const ImageModel = require("../models/dest"); // ✅ Correct model for images

exports.uploadImages = async (req, res) => {
  try {
    const files = req.files;
    const { destId } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    if (!destId) {
      return res.status(400).json({ message: "Location ID is required" });
    }

    const savedImages = [];

    for (const file of files) {
      const fileRef = ref(storage, `images/destinations/${file.originalname}`);
      await uploadBytes(fileRef, file.buffer);
      const url = await getDownloadURL(fileRef);

      const newImage = await ImageModel.create({
        url,
        name: file.originalname,
        destId, // ✅ Associate image with Destination
      });

      savedImages.push(newImage); // ✅ Add to result array
    }

    res.status(201).json({
      message: "Images uploaded successfully",
      data: savedImages,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const imageRecord = await ImageModel.findById(id);
    if (!imageRecord) {
      return res.status(404).json({ message: "Image not found" });
    }

    const imageName = imageRecord.name;
    const fileRef = ref(storage, `images/destinations/${imageName}`);
    await deleteObject(fileRef);

    await ImageModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const { destId } = req.query;
    const filter = destId ? { destId } : {};

    const images = await ImageModel.find(filter).populate("destId");

    res.status(200).json(images);
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch images", error: error.message });
  }
};

exports.addDestination = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Location name is required" });
    }

    const existing = await DestinationModel.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "Location already exists" });
    }

    const newDestination = new DestinationModel({ name: name.trim() });
    await newDestination.save();

    res
      .status(201)
      .json({ message: "destinatin added successfully", data: newDestination });
  } catch (error) {
    console.error("Error in addDestination:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getAllDestination = async (req, res) => {
  try {
    const destination = await DestinationModel.find({});
    res.status(200).json(destination);
  } catch (err) {
    console.error("Error fetching destination:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the destination exists
    const destination = await DestinationModel.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    // Delete only the destination
    await DestinationModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (err) {
    console.error("Error deleting destination:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
