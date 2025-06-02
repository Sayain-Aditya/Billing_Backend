const mongoose = require('mongoose');

const fcmTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Add timestamps
});

// Add index
fcmTokenSchema.index({ token: 1 }, { unique: true });

// Add pre-save middleware for validation
fcmTokenSchema.pre('save', function(next) {
    if (!this.token) {
        next(new Error('Token is required'));
    }
    next();
});

const FCMToken = mongoose.model('FCMToken', fcmTokenSchema);

module.exports = FCMToken;