const mongoose = require('mongoose');
const ReminderSchema = new mongoose.Schema({
  leadId: String,
  followUpDate: Date,
  subscriptions: [Object],
  message: String,
});
module.exports = mongoose.model('Reminder', ReminderSchema);
