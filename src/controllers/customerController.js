const express = require("mongoose");
const {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("../utils/firebase");
const Customer = require("../models/customer");

// exports.addCustomer = async (req, res) => {
//   try {
//     const { name, phone, email, Address, WhatsApp } = req.body;

//     if (!name || !phone || !email || !Address) {
//       return res.status(400).json({ error: "Please fill all required fields." });
//     }

//     let imageUrl = "";

//     // If file uploaded
//     if (req.file) {
//       const file = req.file;
//       const storageRef = ref(storage, `customers/${Date.now()}_${file.originalname}`);

//       const metadata = {
//         contentType: file.mimetype,
//       };

//       await uploadBytes(storageRef, file.buffer, metadata);
//       imageUrl = await getDownloadURL(storageRef);
//     }

//     const newCustomer = new Customer({
//       name,
//       phone,
//       email,
//       Address,
//       WhatsApp,
//       imageUrl,
//     });

//     const savedCustomer = await newCustomer.save();
//     res.status(201).json(savedCustomer);
//   } catch (error) {
//     console.error("Error adding customer:", error);
//     res.status(500).json({ error: "Server Error: " + error.message });
//   }
// };
exports.addCustomer = async (req, res) => {
  console.log("Recived data:", req.body);

  const { name, phone, email, Address, WhatsApp } = req.body;

  if (!name || !phone || !email || !Address || !WhatsApp) {
    console.log("❌ Missing required fields");
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided.",
    });
  }
  try {
    const newCustomer = new Customer({
      name,
      phone,
      email,
      Address,
      WhatsApp,
    });
    await newCustomer.save();
    res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    console.error("Error saving:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCustomer = async (req, res) => {
  try {
    const custom = await Customer.find();
    res.status(200).json({ success: true, data: custom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
