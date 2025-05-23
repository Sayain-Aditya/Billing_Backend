const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

const productRoutes = require('./src/routes/productRoutes');
const invoiceformRoutes = require('./src/routes/invoiceformRoutes');
const commonRoutes = require('./src/routes/commonRoutes'); // ✅ Only declare once
const hotelRoutes = require('./src/routes/hotelRoutes'); // ✅ Only declare once
const destinationRoutes = require('./src/routes/destinationRoutes'); // ✅ Only declare once
const iternaryRoutes = require('./src/routes/iternaryRoutes'); // ✅ Only declare once
const Customer = require('./src/routes/customerRoutes')

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

app.use('/billing', productRoutes);
app.use('/invoices', invoiceformRoutes);
app.use('/common', commonRoutes); // ✅ Only use once
app.use('/', hotelRoutes); // ✅ Only use once
app.use('/gals', hotelRoutes); // ✅ Only use once
app.use('/', destinationRoutes); // ✅ Only use once
app.use('/dest', destinationRoutes); // ✅ Only use once
app.use('/Iternary', iternaryRoutes); // 👈 lowercase
app.use('/customer', Customer)
app.listen(PORT, () => {
    console.log("🚀 Server started on port", PORT);
});
