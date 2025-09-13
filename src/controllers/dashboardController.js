const Car = require("../models/car");
const Customer = require("../models/customer");
const Invoice = require("../models/invoiceForm");
const Lead = require("../models/lead");
const ProductDetails = require("../models/product");
const Iternary = require("../models/Iternary");

// 📊 Overall stats (for cards)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalInvoices = await Invoice.countDocuments();
    const totalLeads = await Lead.countDocuments();
    const totalProducts = await ProductDetails.countDocuments();
    const totalIternaries = await Iternary.countDocuments(); // Added itinerary count

    // 💰 Total revenue from invoices
    const revenueAgg = await Invoice.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$amountDetails.totalAmount" } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    res.json({
      cars: totalCars,
      customers: totalCustomers,
      invoices: totalInvoices,
      leads: totalLeads,
      products: totalProducts,
      iternaries: totalIternaries, // Added to response
      revenue: totalRevenue,
    });
  } catch (err) {
    console.error("❌ Dashboard Error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

// 📈 Revenue by month (for charts)
exports.getRevenueByMonth = async (req, res) => {
  try {
    const data = await Invoice.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          totalRevenue: { $sum: "$amountDetails.totalAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const formatted = data.map(d => ({
      month: `${d._id.month}-${d._id.year}`,
      revenue: d.totalRevenue
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Revenue Chart Error:", err);
    res.status(500).json({ error: "Failed to fetch revenue data" });
  }
};

// 👥 Recent customers
exports.getRecentCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(customers);
  } catch (err) {
    console.error("❌ Customers Error:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

// 🧾 Recent invoices
exports.getRecentInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customerId", "name email");

    res.json(invoices);
  } catch (err) {
    console.error("❌ Invoices Error:", err);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

// 📌 Recent Itineraries
exports.getRecentIternaries = async (req, res) => {
  try {
    const iternaries = await Iternary.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(iternaries);
  } catch (err) {
    console.error("❌ Itineraries Error:", err);
    res.status(500).json({ error: "Failed to fetch itineraries" });
  }
};
