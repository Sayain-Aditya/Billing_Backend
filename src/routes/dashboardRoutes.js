const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// 📊 Overall stats (cards)
router.get("/stats", dashboardController.getDashboardStats);

// 📈 Revenue chart
router.get("/revenue", dashboardController.getRevenueByMonth);

// 👥 Recent customers
router.get("/recent-customers", dashboardController.getRecentCustomers);

// 🧾 Recent invoices
router.get("/recent-invoices", dashboardController.getRecentInvoices);

// 🗺️ Recent itineraries
router.get("/recent-iternaries", dashboardController.getRecentIternaries);

module.exports = router;
