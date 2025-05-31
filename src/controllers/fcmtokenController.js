const FCMToken = require("../models/fcmToken");

exports.saveToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Token is required" });

  try {
    const existing = await FCMToken.findOne({ token });
    if (!existing) {
      await FCMToken.create({ token });
    }
    res.status(200).json({ message: "Token saved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
