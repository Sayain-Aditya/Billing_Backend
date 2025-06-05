const express = require('express');
const router = express.Router();
const webpush = require('../push');
const UserSubscription = require('../models/UserSubscription');

let subscriptions = []; // In production, store in DB

// Endpoint to save subscription
router.post('/subscribe', async (req, res) => {
  const { email, subscription } = req.body;
  if (!email || !subscription) return res.status(400).json({ error: 'Email and subscription required' });

  let userSub = await UserSubscription.findOne({ email });
  if (userSub) {
    // Add subscription if not already present
    const exists = userSub.subscriptions.some(
      (sub) => JSON.stringify(sub) === JSON.stringify(subscription)
    );
    if (!exists) {
      userSub.subscriptions.push(subscription);
      await userSub.save();
    }
  } else {
    userSub = new UserSubscription({ email, subscriptions: [subscription] });
    await userSub.save();
  }
  res.status(201).json({ message: 'Subscription saved' });
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
