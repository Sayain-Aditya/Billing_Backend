const mongoose = require('mongoose');
const UserSubscriptionSchema = new mongoose.Schema({
  email: String,
  subscriptions: [Object], // Array of push subscriptions
});
module.exports = mongoose.model('UserSubscription', UserSubscriptionSchema);