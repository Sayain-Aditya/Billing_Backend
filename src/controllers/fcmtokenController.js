const FCMToken = require("../models/fcmToken");

exports.saveToken = async (req, res) => {
  try {
    // Log the request body
    console.log('Save token request body:', req.body);
    
    const { token } = req.body;
    if (!token) {
      console.log('Token missing in request');
      return res.status(400).json({ message: "Token is required" });
    }

    // Log the token being processed
    console.log('Processing token:', token);

    const existing = await FCMToken.findOne({ token });
    if (existing) {
      console.log('Token already exists:', token);
      return res.status(200).json({ message: "Token already exists" });
    }

    // Create new token
    const newToken = new FCMToken({ token });
    await newToken.save();
    
    console.log('Token saved successfully:', token);
    res.status(200).json({ message: "Token saved successfully" });
  } catch (err) {
    // Log the full error
    console.error('Error in saveToken:', {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    
    // Send detailed error in development
    const errorResponse = {
      message: "Server error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    };
    
    res.status(500).json(errorResponse);
  }
};

exports.updateToken = async (req, res) => {
  try {
    const { oldToken, newToken } = req.body;
    if (!oldToken || !newToken) {
      return res.status(400).json({ message: "Both oldToken and newToken are required" });
    }

    const existing = await FCMToken.findOne({ token: oldToken });
    if (!existing) {
      return res.status(404).json({ message: "Old token not found" });
    }

    existing.token = newToken;
    await existing.save();

    console.log('Token updated successfully:', { oldToken, newToken });
    res.status(200).json({ message: "Token updated successfully" });
  } catch (err) {
    console.error('Error in updateToken:', {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    
    res.status(500).json({
      message: "Server error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
