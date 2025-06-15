const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    Address: { type: String, required: true },
    enquiry: { type: String, required: true },
    followUpDate: { type: Date, required: true }, 
    followUpStatus: { type: String, required: true }, 
    meetingdate: { type: Date, required: true }, 
    status: { type: String, required: true },
    calldate: { type: Date, required: true }, 
    // update: { type: Date, required: true },
    notes: { type: String, required: true },
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("Lead", leadSchema);
