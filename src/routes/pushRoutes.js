const express = require('express');
const router = express.Router();
const webpush = require('../push');

let subscriptions = []; // In production, store in DB

// Endpoint to save subscription
router.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

// Endpoint to trigger a notification to all subscribers
router.post('/notify', async (req, res) => {
  const { title, body } = req.body;
  const payload = JSON.stringify({ title, body });

  // Send notification to all subscribers
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.error('Push error:', err);
    }
  }
  res.status(200).json({ message: 'Notifications sent' });
});

module.exports = router;