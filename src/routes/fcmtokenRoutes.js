const express = require('express');
const { saveToken } = require('../controllers/fcmtokenController');

const router = express.Router();

// Route to save FCM token
router.post('/save', saveToken);

module.exports = router;