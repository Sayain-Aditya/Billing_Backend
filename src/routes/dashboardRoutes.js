const express = require("express");
const {
  getDashboardStats,
  getRevenueByMonth,
  getRecentCustomers,
  getRecentInvoices
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/stats", getDashboardStats);           // Cards: total cars, customers, invoices, leads, products, revenue
router.get("/revenue", getRevenueByMonth);         // Chart: revenue per month
router.get("/recent-customers", getRecentCustomers); // Table/List: recent customers
router.get("/recent-invoices", getRecentInvoices);   // Table/List: recent invoices

module.exports = router;
