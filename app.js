const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

const productRoutes = require("./src/routes/productRoutes");
const invoiceformRoutes = require("./src/routes/invoiceformRoutes");
const commonRoutes = require("./src/routes/commonRoutes"); // ✅ Only declare once
const hotelRoutes = require("./src/routes/hotelRoutes"); // ✅ Only declare once
const destinationRoutes = require("./src/routes/destinationRoutes"); // ✅ Only declare once
const iternaryRoutes = require("./src/routes/iternaryRoutes"); // ✅ Only declare once
const Customer = require("./src/routes/customerRoutes");
const leadRoutes = require("./src/routes/leadRoutes");
const pushRoutes = require('./src/routes/pushRoutes');
const Reminder = require('./src/models/reminder');
const schedule = require('node-schedule');
const webpush = require('./src/push');

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://crm-two-beige.vercel.app",
  "https://billing-backend-seven.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

app.use("/billing", productRoutes);
app.use("/invoices", invoiceformRoutes);
app.use("/common", commonRoutes); // ✅ Only use once
app.use("/", hotelRoutes); // ✅ Only use once
app.use("/gals", hotelRoutes); // ✅ Only use once
app.use("/", destinationRoutes); // ✅ Only use once
app.use("/dest", destinationRoutes); // ✅ Only use once
app.use("/Iternary", iternaryRoutes); // 👈 lowercase
app.use("/customer", Customer);
app.use("/lead", leadRoutes);
app.use('/push', pushRoutes);

// Function to schedule a reminder
function scheduleReminder(reminder) {
  // Only schedule if the time is in the future
  if (new Date(reminder.followUpDate) > new Date()) {
    schedule.scheduleJob(new Date(reminder.followUpDate), async function() {
      try {
        await webpush.sendNotification(
          reminder.subscription,
          JSON.stringify({
            title: 'Lead Follow-up Reminder',
            body: reminder.message,
          })
        );
      } catch (err) {
        console.error('Push notification error:', err);
        // Remove the reminder if the subscription is invalid
        if (err.statusCode === 410 || err.statusCode === 404) {
          await Reminder.deleteOne({ _id: reminder._id });
        }
      }
    });
  }
}

// On server startup, re-schedule all future reminders
Reminder.find({ followUpDate: { $gt: new Date() } }).then(reminders => {
  reminders.forEach(scheduleReminder);
});

app.listen(PORT, () => {
  console.log("🚀 Server started on port", PORT);
});
