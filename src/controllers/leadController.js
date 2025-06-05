const Lead = require("../models/lead"); // Fix variable name
const Reminder = require('../models/reminder');
const schedule = require('node-schedule');
const webpush = require('../push');

exports.addLead = async (req, res) => {
  console.log("Recived data:", req.body); // Fix syntax

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
    subscription,
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

    if (subscription && followUpDate) {
      // Ensure followUpDate is stored as UTC
      const followUpDateUTC = new Date(followUpDate).toISOString();
      // Try to find an existing reminder for this lead and followUpDate
      let reminder = await Reminder.findOne({ leadId: newLead._id, followUpDate: followUpDateUTC });
      if (reminder) {
        // Add subscription if not already present
        const exists = reminder.subscriptions.some(
          (sub) => JSON.stringify(sub) === JSON.stringify(subscription)
        );
        if (!exists) {
          reminder.subscriptions.push(subscription);
          await reminder.save();
        }
      } else {
        reminder = new Reminder({
          leadId: newLead._id,
          followUpDate: followUpDateUTC,
          subscriptions: [subscription],
          message: `Follow-up reminder for ${name} regarding ${enquiry}`,
        });
        await reminder.save();
      }
      // Schedule the notification
      schedule.scheduleJob(new Date(followUpDateUTC), async function() {
        for (const sub of reminder.subscriptions) {
          try {
            await webpush.sendNotification(
              sub,
              JSON.stringify({
                title: 'Lead Follow-up Reminder',
                body: reminder.message,
              })
            );
          } catch (err) {
            console.error('Push notification error:', err);
            // Remove the subscription if invalid
            if (err.statusCode === 410 || err.statusCode === 404) {
              reminder.subscriptions = reminder.subscriptions.filter(
                (s) => JSON.stringify(s) !== JSON.stringify(sub)
              );
              await reminder.save();
            }
          }
        }
      });
    }

    res.status(201).json({ success: true, data: newLead }); // Fix typo
  } catch (error) {
    console.error("Error saving:", error);
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
    subscription,
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

    if (subscription && followUpDate) {
      // Ensure followUpDate is stored as UTC
      const followUpDateUTC = new Date(followUpDate).toISOString();
      // Try to find an existing reminder for this lead and followUpDate
      let reminder = await Reminder.findOne({ leadId: updatedLead._id, followUpDate: followUpDateUTC });
      if (reminder) {
        // Add subscription if not already present
        const exists = reminder.subscriptions.some(
          (sub) => JSON.stringify(sub) === JSON.stringify(subscription)
        );
        if (!exists) {
          reminder.subscriptions.push(subscription);
          await reminder.save();
        }
      } else {
        reminder = new Reminder({
          leadId: updatedLead._id,
          followUpDate: followUpDateUTC,
          subscriptions: [subscription],
          message: `Follow-up reminder for ${name} regarding ${enquiry}`,
        });
        await reminder.save();
      }
      // Schedule the notification
      schedule.scheduleJob(new Date(followUpDateUTC), async function() {
        for (const sub of reminder.subscriptions) {
          try {
            await webpush.sendNotification(
              sub,
              JSON.stringify({
                title: 'Lead Follow-up Reminder',
                body: reminder.message,
              })
            );
          } catch (err) {
            console.error('Push notification error:', err);
            // Remove the subscription if invalid
            if (err.statusCode === 410 || err.statusCode === 404) {
              reminder.subscriptions = reminder.subscriptions.filter(
                (s) => JSON.stringify(s) !== JSON.stringify(sub)
              );
              await reminder.save();
            }
          }
        }
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
