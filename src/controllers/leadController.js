const Lead = require("../models/lead");
const FCMToken = require("../models/fcmToken"); // Fix the variable name
const admin = require("../config/firebaseAdmin");

exports.addLead = async (req, res) => {
  console.log("Received data:", req.body);

  const {
    name,
    email,
    phone,
    Address,
    enquiry,
    followUpDate,
    followUpStatus,
    meetingdate,
    status,
    calldate,
    update,
    notes,
  } = req.body;

  if (
    !name ||
    !email ||
    !phone ||
    !Address ||
    !enquiry ||
    !followUpDate ||
    !followUpStatus ||
    !meetingdate ||
    !status ||
    !calldate ||
    !update ||
    !notes
  ) {
    console.log("Missing Required fields");
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided.",
    });
  }

  try {
    const newLead = new Lead({
      name,
      email,
      phone,
      Address,
      enquiry,
      followUpDate,
      followUpStatus,
      meetingdate,
      status,
      calldate,
      update,
      notes,
    });

    await newLead.save();
    console.log('New lead saved:', newLead._id);

    // Enhanced FCM notification handling
    try {
      // Get all FCM tokens
      const tokens = await FCMToken.find().select("token -_id");
      console.log(`Found ${tokens.length} FCM tokens`);
      
      if (tokens.length === 0) {
        console.log('No FCM tokens found to send notifications');
        return res.status(201).json({ success: true, data: newLead });
      }

      const notification = {
        title: "New Lead Created",
        body: `${name} submitted a new enquiry.`
      };

      const data = {
        leadId: newLead._id.toString(),
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        type: "new_lead",
        name: name,
        email: email,
        phone: phone,
        enquiry: enquiry
      };

      console.log('Preparing to send notifications with payload:', { notification, data });

      // Send to each token
      const sendPromises = tokens.map(async ({ token }) => {
        try {
          const message = {
            token,
            notification,
            data,
            android: {
              priority: "high",
              notification: {
                sound: "default",
                priority: "high",
                channelId: "leads"
              }
            },
            apns: {
              payload: {
                aps: {
                  sound: "default",
                  badge: 1
                }
              }
            }
          };

          console.log(`Sending notification to token: ${token}`);
          const result = await admin.messaging().send(message);
          console.log('Successfully sent message:', result);
          return result;
        } catch (err) {
          console.error(`Error sending to token ${token}:`, err);
          
          if (err.code === 'messaging/invalid-registration-token' || 
              err.code === 'messaging/registration-token-not-registered') {
            console.log(`Removing invalid token: ${token}`);
            await FCMToken.deleteOne({ token });
          }
          return null;
        }
      });

      const results = await Promise.all(sendPromises);
      const successfulSends = results.filter(Boolean).length;
      console.log(`Successfully sent ${successfulSends} notifications out of ${tokens.length} tokens`);

    } catch (notificationError) {
      console.error('Error in notification process:', notificationError);
      // Continue since the lead was still created successfully
    }

    res.status(201).json({ 
      success: true, 
      data: newLead,
      message: 'Lead created successfully and notifications sent'
    });
  } catch (error) {
    console.error("Error saving lead:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllLead = async (req, res) => {
  try {
    const led = await Lead.find();
    res.status(200).json({ success: true, data: led });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedLead = await Lead.findByIdAndDelete(id);
    if (!deletedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getLeadById = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }
    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.updateLead = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone,
    Address,
    enquiry,
    followUpDate,
    followUpStatus,
    meetingdate,
    status,
    calldate,
    update,
    notes,
  } = req.body;

  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        Address,
        enquiry,
        followUpDate,
        followUpStatus,
        meetingdate,
        status,
        calldate,
        update,
        notes,
      },
      { new: true, runValidators: true }
    );
    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedLead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
