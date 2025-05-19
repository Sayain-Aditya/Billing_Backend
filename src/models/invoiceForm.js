const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    customerGST: {
        type: String, // Customer GSTIN
        required: true
    },
    invoiceDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    customerAddress: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    dispatchThrough: {
        type: String,
        default: ""
    },
    customerAadhar: {
        type: String,
        required: true
    },
    productDetails: [
        {
            description: {
                type: String,
                required: true
            },
            unit: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            discountPercentage: {
                type: Number,
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }
    ],
    amountDetails: {
        gstPercentage: {
            type: Number,
            required: true
        },
     
        discountOnTotal: {
            type: Number,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
