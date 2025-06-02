const express = require('express');
const router = express.Router();
const fcmTokenController = require('../controllers/fcmtokenController');

// Route to save FCM token
router.post('/save', fcmTokenController.saveToken);

// Route to update FCM token
router.put('/update', fcmTokenController.updateToken);

module.exports = router;