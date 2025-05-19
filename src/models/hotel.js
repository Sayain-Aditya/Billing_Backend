const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    location: { type: String },
    // Add more fields as needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);