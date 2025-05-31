const expree = require('express');
const { saveToken } = require('../controllers/fcmtokenController');
const router = exprees.Router();

// Route to save FCM token
router.post('/save', saveToken);

module.exports = router;