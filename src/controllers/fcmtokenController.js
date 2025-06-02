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

exports.updateToken = async (req, res) => {
  const { oldToken, newToken } = req.body;
  if (!oldToken || !newToken) {
    return res.status(400).json({ message: "Both oldToken and newToken are required" });
  }

  try {
    const existing = await FCMToken.findOne({ token: oldToken });
    if (!existing) {
      return res.status(404).json({ message: "Old token not found" });
    }

    existing.token = newToken;
    await existing.save();

    res.status(200).json({ message: "Token updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};