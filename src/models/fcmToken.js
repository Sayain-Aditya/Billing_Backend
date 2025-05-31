const mongoose = require('mongoose');
const fcmTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d' // Token will expire after 30 days
    }
});
module.exports = mongoose.model("FCMToken", fcmTokenSchema);