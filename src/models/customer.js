const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  Address: { type: String, required: true },
  WhatsApp: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);