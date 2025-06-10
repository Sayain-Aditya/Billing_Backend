const Car = require("../models/car");
const Reminder = require("../models/reminder");
const webpush = require("../push");
const schedule = require("node-schedule");

exports.addCar = async (req, res) => {
  console.log("Recived data:", req.body);
  const { carNumber, insurance, pollution, serviceReminder, subscription } =
    req.body;

  if (
    !carNumber ||
    !insurance ||
    !pollution ||
    !serviceReminder ||
    !subscription
  ) {
    console.log("Missing Required fields");
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided.",
    });
  }

  try {
    console.log("Creating new car");
    const newCar = new Car({
      carNumber,
      insurance,
      pollution,
      serviceReminder,
    });
    await newCar.save();
    console.log("Car saved successfully");

    if (subscription && insurance && pollution && serviceReminder) {
      const insuranceDate = new Date(insurance);
      const pollutionDate = new Date(pollution);
      const reminderDate = new Date(serviceReminder);

      if (isNaN(reminderDate) || isNaN(insuranceDate) || isNaN(pollutionDate)) {
        console.error(
          "Invalid date for serviceReminder, insurance, or pollution:",
          {
            serviceReminder,
            insurance,
            pollution,
          }
        );
        return res.status(400).json({
          success: false,
          message: "Invalid date for service reminder",
        });
      }

      const reminder = new Reminder({
        carId: newCar._id,
        insurance,
        pollution,
        serviceReminder,
        subscription,
        message: `Reminder for car ${carNumber} has been set.`,
      });
      await reminder.save();
      console.log("Reminder saved successfully");

      schedule.scheduleJob(insuranceDate, async () => {
        console.log("Sending insurance notification for car:", carNumber);
        const payload = JSON.stringify({
          title: "Car Insurance Reminder",
          body: `Insurance for car ${carNumber} is due.`,
        });

        try {
          await webpush.sendNotification(subscription, payload);
          console.log("Insurance notification sent successfully");
        } catch (error) {
          console.error("Error sending insurance notification:", error);
        }
      });
      schedule.scheduleJob(pollutionDate, async () => {
        console.log("Sending pollution notification for car:", carNumber);
        const payload = JSON.stringify({
          title: "Car Pollution Reminder",
          body: `Pollution check for car ${carNumber} is due.`,
        });

        try {
          await webpush.sendNotification(subscription, payload);
          console.log("Pollution notification sent successfully");
        } catch (error) {
          console.error("Error sending pollution notification:", error);
        }
      });

      schedule.scheduleJob(reminderDate, async () => {
        console.log("Sending notification for car:", carNumber);
        const payload = JSON.stringify({
          title: "Car Reminder",
          body: `Reminder for car ${carNumber} is due.`,
        });

        try {
          await webpush.sendNotification(subscription, payload);
          console.log("Notification sent successfully");
        } catch (error) {
          console.error("Error sending notification:", error);
        }
      });
    }

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
  const { carNumber, insurance, pollution, serviceReminder, subscription } =
    req.body;

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

    if (subscription && insurance && pollution && serviceReminder) {
      const reminderDate = new Date(serviceReminder);
      const insuranceDate = new Date(insurance);
      const pollutionDate = new Date(pollution);
      if (isNaN(reminderDate) || isNaN(insuranceDate) || isNaN(pollutionDate)) {
        console.error(
          "Invalid date for serviceReminder, insurance, or pollution:",
          {
            serviceReminder,
            insurance,
            pollution,
          }
        );
        return res.status(400).json({
          success: false,
          message: "Invalid date for service reminder",
        });
      }

      const reminder = new Reminder({
        carId: updatedCar._id,
        insurance,
        pollution,
        serviceReminder,
        subscription,
        message: `Reminder for car ${carNumber} has been updated.`,
      });
      await reminder.save();
      console.log("Reminder updated successfully");

      schedule.scheduleJob(insuranceDate, async () => {
        try {
          await webpush.sendNotification(
            subscription,
            JSON.stringify({
              title: "Car Insurance Reminder",
              body: `Updated insurance for car ${carNumber} is due.`,
            })
          );
        } catch (error) {
          console.error("Error sending insurance notification:", error);
        }
      });

      schedule.scheduleJob(pollutionDate, async () => {
        try {
          await webpush.sendNotification(
            subscription,
            JSON.stringify({
              title: "Car Pollution Reminder",
              body: `Updated pollution check for car ${carNumber} is due.`,
            })
          );
        } catch (error) {
          console.error("Error sending pollution notification:", error);
        }
      });

      schedule.scheduleJob(reminderDate, async () => {
        try {
          await webpush.sendNotification(
            subscription,
            JSON.stringify({
              title: "Car Reminder",
              body: `Updated reminder for car ${carNumber} is due.`,
            })
          );
        } catch (error) {
          console.error("Error sending notification:", error);
        }
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
