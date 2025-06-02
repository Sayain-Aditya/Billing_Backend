const express = require('express');
const router = express.Router();
const FCMToken = require('../models/fcmToken');

// Route to save FCM token
router.post('/save', async (req, res) => {
    try {
        // Log the incoming request
        console.log('Received token save request:', {
            body: req.body,
            headers: req.headers
        });
        
        const { token } = req.body;
        
        if (!token) {
            console.log('Token missing in request');
            return res.status(400).json({ 
                success: false,
                message: "Token is required" 
            });
        }

        // Try to find existing token
        console.log('Checking for existing token...');
        const existingToken = await FCMToken.findOne({ token });
        
        if (existingToken) {
            console.log('Token already exists:', token);
            return res.status(200).json({ 
                success: true,
                message: "Token already exists" 
            });
        }

        // Create new token document
        console.log('Creating new token document...');
        const newToken = new FCMToken({ token });
        
        // Save the token
        console.log('Saving token...');
        const savedToken = await newToken.save();
        console.log('Token saved successfully:', savedToken);
        
        res.status(200).json({ 
            success: true,
            message: "Token saved successfully",
            token: savedToken
        });
    } catch (error) {
        // Log the full error
        console.error('Error in /save route:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            name: error.name
        });
        
        // Check for duplicate key error
        if (error.code === 11000) {
            return res.status(200).json({ 
                success: true,
                message: "Token already exists" 
            });
        }
        
        // Send error response
        res.status(500).json({ 
            success: false,
            message: "Server error",
            details: error.message
        });
    }
});

module.exports = router;