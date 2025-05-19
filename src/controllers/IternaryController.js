const mongoose = require("mongoose");

const Iternary = require("../models/Iternary");

exports.createIternary = async (req, res) => {
  console.log("▶️ Received Iternary Data:", req.body); // 👈 Add this

  const {
    title,
    days,
    date,
    pickLoc,
    dropLoc,
    pickTime,
    dropTime,
    vehicle,
    package,
    cost,
    personNo,
    hotelType,
    advance,
    costInclude,
    costExclude,
    dynamicFields,
    hotelSelected,
    destinations,
  } = req.body;

  // Validate required fields
  if (
    !title ||
    !days ||
    !date ||
    !pickLoc ||
    !dropLoc ||
    !pickTime ||
    !dropTime ||
    !vehicle ||
    !package ||
    !cost ||
    !personNo ||
    !hotelType ||
    !advance ||
    !(costInclude && costInclude.length) ||
    !(costExclude && costExclude.length) ||
    !(dynamicFields && dynamicFields.length) ||
    !(hotelSelected && hotelSelected.length) ||
    !(destinations && destinations.length)
  ) {
    console.log("❌ Missing required fields");
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided.",
    });
  }

  try {
    const newIternary = new Iternary({
      title,
      days,
      date,
      pickLoc,
      dropLoc,
      pickTime,
      dropTime,
      vehicle,
      package,
      cost,
      personNo,
      hotelType,
      advance,
      costInclude,
      costExclude,
      dynamicFields,
      hotelSelected,
      destinations,
    });

    await newIternary.save();
    res.status(201).json({ success: true, data: newIternary });
  } catch (error) {
    console.error("🔥 Error saving itinerary:", error); // 👈 Add this
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getAllIternaries = async (req, res) => {
  try {
    const iternaries = await Iternary.find();
    res.status(200).json({ success: true, data: iternaries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getIternaryById = async (req, res) => {
  const { id } = req.params;
  try {
    const iternary = await Iternary.findById(id);
    if (!iternary) {
      return res.status(404).json({
        success: false,
        message: "Iternary not found",
      });
    }
    res.status(200).json({ success: true, data: iternary });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.updateIternary = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    days,
    date,
    pickLoc,
    dropLoc,
    pickTime,
    dropTime,
    vehicle,
    package,
    cost,
    personNo,
    hotelType,
    advance,
    costInclude,
    costExclude,
    dynamicFields,
    hotelSelected,
    destinations,
  } = req.body;

  try {
    const updatedIternary = await Iternary.findByIdAndUpdate(
      id,
      {
        title,
        days,
        date,
        pickLoc,
        dropLoc,
        pickTime,
        dropTime,
        vehicle,
        package,
        cost,
        personNo,
        hotelType,
        advance,
        costInclude,
        costExclude,
        dynamicFields,
        hotelSelected,
        destinations,
      },
      { new: true, runValidators: true }
    );

    if (!updatedIternary) {
      return res.status(404).json({
        success: false,
        message: "Iternary not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedIternary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteIternary = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedIternary = await Iternary.findByIdAndDelete(id);
    if (!deletedIternary) {
      return res.status(404).json({
        success: false,
        message: "Iternary not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Iternary deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
