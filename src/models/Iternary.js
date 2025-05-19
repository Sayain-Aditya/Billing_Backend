const mongoose = require("mongoose");
const iternarySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    pickLoc: {
      type: String,
      required: true,
    },
    dropLoc: {
      type: String,
      required: true,
    },
    pickTime: {
      type: String,
      required: true,
    },
    dropTime: {
      type: String,
      required: true,
    },
    vehicle: {
      type: String,
      required: true,
    },
    package: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    personNo: {
      type: Number,
      required: true,
    },
    hotelType: {
      type: String,
      required: true,
    },
    advance: {
      type: Number,
      required: true,
    },
    costInclude: {
      type: [String],
      default: [],
    },
    costExclude: {
      type: [String],
      default: [],
    },
    hotelSelected: {
      type: [String],
      required: true,
    },
    destinations: {
      type: [String],
      required: true,
    },
    dynamicFields: {
      type: [
        {
          dayTitle: { type: String, required: true }, // e.g., "Your tour starts from Gorakhpur..."
          points: [{ type: String, required: true }], // bullet points
        },
      ],
      default: [],
    },
  },
  { timestamps: true, strict: true }
);
module.exports = mongoose.model("Iternary", iternarySchema);
