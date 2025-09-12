const DestinationModel = require("../models/destination");
const ImageModel = require("../models/dest");
const cloudinary = require("../config/cloudinary");

// Upload destination images
exports.uploadImages = async (req, res) => {
  try {
    const files = req.files;
    const { destId } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    if (!destId) {
      return res.status(400).json({ message: "Destination ID is required" });
    }

    const savedImages = await Promise.all(
      files.map(async (file) => {
        return await ImageModel.create({
          url: file.path,            // ✅ Cloudinary auto URL
          public_id: file.filename,  // ✅ Cloudinary auto public_id
          name: file.originalname,   // local original file name
          destId,
        });
      })
    );

    res.status(201).json({
      message: "Images uploaded successfully",
      data: savedImages,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete destination image
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const imageRecord = await ImageModel.findById(id);

    if (!imageRecord) return res.status(404).json({ message: "Image not found" });

    if (imageRecord.public_id) {
      await cloudinary.uploader.destroy(imageRecord.public_id); // ✅ delete from Cloudinary
    }

    await ImageModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all images
exports.getAllImages = async (req, res) => {
  try {
    const { destId } = req.query;
    const filter = destId ? { destId } : {};
    const images = await ImageModel.find(filter).populate("destId");
    res.status(200).json(images);
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch images", error: error.message });
  }
};

// Add destination
exports.addDestination = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Location name is required" });

    const existing = await DestinationModel.findOne({ name: name.trim() });
    if (existing) return res.status(409).json({ message: "Location already exists" });

    const newDestination = new DestinationModel({ name: name.trim() });
    await newDestination.save();

    res.status(201).json({ message: "Destination added successfully", data: newDestination });
  } catch (error) {
    console.error("❌ Error in addDestination:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all destinations
exports.getAllDestination = async (req, res) => {
  try {
    const destinations = await DestinationModel.find({});
    res.status(200).json(destinations);
  } catch (err) {
    console.error("❌ Error fetching destinations:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete destination
exports.deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await DestinationModel.findById(id);

    if (!destination) return res.status(404).json({ message: "Destination not found" });

    await DestinationModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting destination:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
