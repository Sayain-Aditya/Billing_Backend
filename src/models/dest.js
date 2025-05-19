const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  destId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
  
}, { timestamps: true });

module.exports = mongoose.model('dest', imageSchema);