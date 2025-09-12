const HotelModel = require("../models/hotel");
const ImageModel = require("../models/gals");
const cloudinary = require("../config/cloudinary");

// // Upload hotel images
// exports.uploadImages = async (req, res) => {
//   try {
//     const files = req.files;
//     const { hotelId } = req.body;

//     if (!files || files.length === 0) {
//       return res.status(400).json({ message: "No images uploaded" });
//     }

//     if (!hotelId) {
//       return res.status(400).json({ message: "Hotel ID is required" });
//     }

//     const savedImages = await Promise.all(
//       files.map(async (file) => {
//         // file.path -> Cloudinary URL, file.filename -> public_id
//         const newImage = await ImageModel.create({
//           url: file.path,
//           public_id: file.filename,
//           name: file.originalname,
//           hotelId,
//         });
//         return newImage;
//       })
//     );

//     res.status(201).json({
//       message: "Images uploaded successfully",
//       data: savedImages,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// Upload hotel images
exports.uploadImages = async (req, res) => {
  try {
    const files = req.files || (req.file ? [req.file] : []); // ✅ support both single & multiple

    const { hotelId } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    if (!hotelId) {
      return res.status(400).json({ message: "Hotel ID is required" });
    }

    const savedImages = await Promise.all(
      files.map(async (file) => {
        return await ImageModel.create({
          url: file.path,          // Cloudinary URL
          public_id: file.filename, // Cloudinary public_id
          name: file.originalname,
          hotelId,
        });
      })
    );

    res.status(201).json({
      message: "Images uploaded successfully",
      data: savedImages,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete hotel image
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const imageRecord = await ImageModel.findById(id);

    if (!imageRecord) return res.status(404).json({ message: "Image not found" });

    if (imageRecord.public_id) {
      await cloudinary.uploader.destroy(imageRecord.public_id);
    }

    await ImageModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all hotel images
exports.getAllImages = async (req, res) => {
  try {
    const { hotelId } = req.query;
    const filter = hotelId ? { hotelId } : {};
    const images = await ImageModel.find(filter).populate("hotelId");
    res.status(200).json(images);
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch images", error: error.message });
  }
};

// Add hotel
exports.addHotel = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Hotel name is required" });

    const existing = await HotelModel.findOne({ name: name.trim() });
    if (existing) return res.status(409).json({ message: "Hotel already exists" });

    const newHotel = new HotelModel({ name: name.trim() });
    await newHotel.save();

    res.status(201).json({ message: "Hotel added successfully", data: newHotel });
  } catch (error) {
    console.error("Error in addHotel:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all hotels
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await HotelModel.find({});
    res.status(200).json(hotels);
  } catch (err) {
    console.error("Error fetching hotels:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete hotel
exports.deleteHotels = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await HotelModel.findById(id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    await HotelModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (err) {
    console.error("Error deleting hotel:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
