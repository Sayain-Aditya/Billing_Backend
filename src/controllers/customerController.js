const express = require("mongoose");
const {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("../utils/firebase");
const Customer = require("../models/customer");

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
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteCustomer = await Customer.findByIdAndDelete(id);
    if (!deleteCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getCustomerId = async (req, res) => {
  const { id } = req.params;
  try {
    const cust = await Customer.findById(id);
    if (!cust) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    res.status(200).json({ success: true, data: cust });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, Address, WhatsApp } = req.body;
  try {
    const updateCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        name,
        phone,
        email,
        Address,
        WhatsApp,
      },
      { new: true, runValidators: true }
    );
    if (!updateCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not Found",
      });
    }
    res.status(200).json({
      success: true,
      data: updateCustomer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
