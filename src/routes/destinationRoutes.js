const express = require("express");
const {
  uploadImages,
  deleteImage,
  getAllImages,
  addDestination,
  getAllDestination,
  deleteDestination,
} = require("../controllers/destinationController");

const uploadMiddleware = require("../middleware/uploadMiddleware");


const router = express.Router();

router.post("/upload-img", uploadMiddleware, uploadImages);
router.delete("/del/:id", deleteImage);
router.get("/alls", getAllImages); // ⚠️ This gets images, not hotels
router.post("/adds", addDestination);

router.get("/destinations", getAllDestination);
router.delete("/destinations/:id", deleteDestination);


module.exports = router;
