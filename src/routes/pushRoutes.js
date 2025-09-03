const express = require('express');
const router = express.Router();

let subscriptions = [];

// Endpoint to save subscription (disabled)
router.post('/subscribe', (req, res) => {
  console.log('Push notifications disabled');
  res.status(201).json({ message: 'Push notifications disabled' });
});

// Endpoint to trigger a notification (disabled)
router.post('/notify', async (req, res) => {
  console.log('Push notifications disabled');
  res.status(200).json({ message: 'Push notifications disabled' });
});

module.exports = router;