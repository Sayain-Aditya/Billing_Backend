const express = require("express");
const {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("../utils/firebase");
const HotelModel = require("../models/hotel"); // ✅ Model for hotels
const ImageModel = require("../models/gals"); // ✅ Correct model for images

exports.uploadImages = async (req, res) => {
  try {
    const files = req.files;
    const { hotelId } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    if (!hotelId) {
      return res.status(400).json({ message: "Hotel ID is required" });
    }

    const savedImages = [];

    for (const file of files) {
      const fileRef = ref(storage, `images/hotels/${file.originalname}`);
      await uploadBytes(fileRef, file.buffer);
      const url = await getDownloadURL(fileRef);

      const newImage = await ImageModel.create({
        url,
        name: file.originalname,
        hotelId, // ✅ Associate image with hotel
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
    const fileRef = ref(storage, `images/hotels/${imageName}`);
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
    const { hotelId } = req.query;
    const filter = hotelId ? { hotelId } : {};

    const images = await ImageModel.find(filter).populate("hotelId");

    res.status(200).json(images);
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch images", error: error.message });
  }
};

exports.addHotel = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Hotel name is required" });
    }

    const existing = await HotelModel.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "Hotel already exists" });
    }

    const newHotel = new HotelModel({ name: name.trim() });
    await newHotel.save();

    res
      .status(201)
      .json({ message: "Hotel added successfully", data: newHotel });
  } catch (error) {
    console.error("Error in addHotel:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await HotelModel.find({});
    res.status(200).json(hotels);
  } catch (err) {
    console.error("Error fetching hotels:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.deleteHotels = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the destination exists
    const destination = await HotelModel.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    // Delete only the destination
    await HotelModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (err) {
    console.error("Error deleting hotel:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};