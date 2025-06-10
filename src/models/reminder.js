const mongoose = require('mongoose');
const ReminderSchema = new mongoose.Schema({
  leadId: String,
  followUpDate: Date,
  carId: String,
  insurance: String,
  pollution: String,
  serviceReminder: String,
  subscription: Object,
  message: String,
});
module.exports = mongoose.model('Reminder', ReminderSchema);