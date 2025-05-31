const Lead = require("../models/lead"); // Fix variable name
const token = require("../models/fcmToken"); // Fix variable name

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

    // ✅ Send FCM notification
    const tokens = await token.find().select("token -_id");
    const payload = {
      notification: {
        title: "New Lead Created",
        body: `${name} submitted a new enquiry.`,
      },
    };

    for (const t of tokens) {
      try {
        await admin.messaging().send({
          token: t.token,
          ...payload,
        });
      } catch (err) {
        console.error("Error sending notification to token:", t.token, err.message);
      }
    }

    res.status(201).json({ success: true, data: newLead });
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
