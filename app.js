require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./src/config/db");

const productRoutes = require("./src/routes/productRoutes");
const invoiceformRoutes = require("./src/routes/invoiceformRoutes");
const commonRoutes = require("./src/routes/commonRoutes"); // ✅ Only declare once
const hotelRoutes = require("./src/routes/hotelRoutes"); // ✅ Only declare once
const destinationRoutes = require("./src/routes/destinationRoutes"); // ✅ Only declare once
const iternaryRoutes = require("./src/routes/iternaryRoutes"); // ✅ Only declare once
const Customer = require("./src/routes/customerRoutes");
const leadRoutes = require("./src/routes/leadRoutes");

const carRoutes = require("./src/routes/carRoutes"); // ✅ Only declare once
const userRoutes = require("./src/routes/userRoutes");



const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://crm-two-beige.vercel.app",
  "https://billing-backend-seven.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);
      
      // Allow specific origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Allow any Vercel deployment
      if (origin.includes('.vercel.app')) {
        return callback(null, true);
      }
      
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));
app.use('/uploads/destinations', express.static('uploads/destinations'));
app.use('/uploads/hotels', express.static('uploads/hotels'));

connectDB();

const PORT = process.env.PORT || 5000;

app.use("/billing", productRoutes);
app.use("/invoices", invoiceformRoutes);
app.use("/common", commonRoutes); // ✅ Only use once
app.use("/hotels", hotelRoutes);        // hotel CRUD + hotel images
app.use("/destinations", destinationRoutes); // destination CRUD + images
app.use("/Iternary", iternaryRoutes); // 👈 lowercase
app.use("/customer", Customer);
app.use("/lead", leadRoutes);

app.use("/car", carRoutes); // ✅ Only use once
app.use("/user", userRoutes);



// Backend error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});