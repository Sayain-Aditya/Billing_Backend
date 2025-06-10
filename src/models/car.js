const mongoose = require("mongoose");
const carSchema = new mongoose.Schema(
  {
    carNumber: { type: String, required: true },
    insurance: { type: String, required: true },
    pollution: { type: String, required: true },
    serviceReminder: { type: String, required: true },
  },
  { timestamps: true, strict: true }
);
module.exports = mongoose.model("Car", carSchema);
