const express = require("express");
const {
  uploadImages,
  deleteImage,
  getAllImages,
  addHotel,
  getAllHotels,
  deleteHotels
} = require("../controllers/hotelController");

const uploadMiddleware = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/upload-images", uploadMiddleware, uploadImages);
router.delete("/delete/:id", deleteImage);
router.get("/all", getAllImages); // ⚠️ This gets images, not hotels
router.post("/add", addHotel);

router.get("/hotels", getAllHotels);
router.delete("/hotels/:id", deleteHotels);


module.exports = router;
