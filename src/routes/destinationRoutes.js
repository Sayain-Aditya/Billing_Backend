const express = require("express");
const {
  uploadImages,
  deleteImage,
  getAllImages,
  addDestination,
  getAllDestination,
  deleteDestination,
} = require("../controllers/destinationController");

const uploadMiddleware = require("../middleware/uploadMiddleware"); // multer setup

const router = express.Router();

// ----- Destination Images -----
router.post("/upload-img", uploadMiddleware.array("images", 10), uploadImages); // ✅ Use .array() for multiple files
router.delete("/del/:id", deleteImage);
router.get("/alls", getAllImages); // gets uploaded images

// ----- Destination CRUD -----
router.post("/add", addDestination); // changed from /adds to /add
router.get("/", getAllDestination);   // changed from /destinations to /
router.delete("/:id", deleteDestination); // changed from /destinations/:id to /:id

module.exports = router;
