const Car = require("../models/car");

exports.addCar = async (req, res) => {
  try {
    const { carNumber, insurance, pollution, serviceReminder } = req.body;

    if (!carNumber || !insurance || !pollution || !serviceReminder) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const newCar = new Car({
      carNumber,
      insurance,
      pollution,
      serviceReminder,
    });
    
    await newCar.save();

    return res.status(201).json({
      success: true,
      message: "Car added successfully",
      car: newCar,
    });
  } catch (error) {
    console.error("Error saving car:", error);
    return res.status(500).json({
      success: false,
      message: "Error saving car",
      error: error.message,
    });
  }
};

exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    return res.status(200).json({
      success: true,
      data: cars,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching cars",
      error: error.message,
    });
  }
};

exports.deleteCar = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCar = await Car.findByIdAndDelete(id);
    if (!deletedCar) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting car:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting car",
      error: error.message,
    });
  }
};

exports.getCarById = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    console.error("Error fetching car:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching car",
      error: error.message,
    });
  }
};

exports.updateCar = async (req, res) => {
  const { id } = req.params;
  const { carNumber, insurance, pollution, serviceReminder } = req.body;

  try {
    const updatedCar = await Car.findByIdAndUpdate(
      id,
      {
        carNumber,
        insurance,
        pollution,
        serviceReminder,
      },
      { new: true }
    );

    if (!updatedCar) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Car updated successfully",
      car: updatedCar,
    });
  } catch (error) {
    console.error("Error updating car:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating car",
      error: error.message,
    });
  }
};