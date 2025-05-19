const mongoose = require('mongoose');

const InvoiceForm = require('../models/invoiceForm');
const Product = require('../models/product');

exports.createInvoice = async (req, res) => {
    try {
        const {
            customerGST,
            invoiceDate,
            dueDate,
            customerName,
            invoiceNumber,
            customerAddress,
            customerPhone,
            customerEmail,
            dispatchThrough,
            customerAadhar,
            productDetails,
            amountDetails
        } = req.body;

        // Validate required fields
        if (
            !customerGST || !invoiceDate || !dueDate || !customerName || !invoiceNumber ||
            !customerAddress || !customerPhone || !customerEmail || !customerAadhar ||
            !productDetails || !amountDetails
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Loop through each product in invoice and update stock
        for (const item of productDetails) {
            const { description, quantity } = item;

            // Find product by name (case insensitive match)
            const product = await Product.findOne({
                productName: { $regex: new RegExp(`^${description}$`, 'i') }
            });

            if (!product) {
                return res.status(404).json({ error: `Product "${description}" not found.` });
            }

            if (product.productStock < quantity) {
                return res.status(400).json({ error: `Not enough stock for "${product.productName}". Available: ${product.productStock}, Requested: ${quantity}` });
            }

            // Subtract the quantity from stock
            product.productStock -= quantity;
            await product.save();
        }

        // Save the invoice
        const invoice = new InvoiceForm({
            customerGST,
            invoiceDate,
            dueDate,
            customerName,
            invoiceNumber,
            customerAddress,
            customerPhone,
            customerEmail,
            dispatchThrough,
            customerAadhar,
            productDetails,
            amountDetails
        });

        await invoice.save();

        return res.status(201).json({
            message: 'Invoice created and stock updated successfully',
            success: true,
            data: invoice
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating invoice",
            success: false,
            error: error.message
        });
    }
};
exports.updateInvoice=async(req,res)=>{
    try {
        const {    customerGST,
            invoiceDate,
            dueDate,
            customerName,
            invoiceNumber,
            customerAddress,
            customerPhone,
            customerEmail,
            dispatchThrough,
            customerAadhar,
            productDetails,
            amountDetails}=req.body;
            const existingInvoice = await InvoiceForm.findById(req.params.id);
            if (!existingInvoice) {
                return res.status(404).json({ error: "Invoice not found" });
            }
            existingInvoice.customerGST = customerGST || existingInvoice.customerGST;
            // existingInvoice.invoiceDate = invoiceDate || existingInvoice.invoiceDate;
            existingInvoice.dueDate = dueDate || existingInvoice.dueDate;
            existingInvoice.customerName = customerName || existingInvoice.customerName;
            // existingInvoice.invoiceNumber = invoiceNumber || existingInvoice.invoiceNumber;
            existingInvoice.customerAddress = customerAddress || existingInvoice.customerAddress;
            existingInvoice.customerPhone = customerPhone || existingInvoice.customerPhone;
            existingInvoice.customerEmail = customerEmail || existingInvoice.customerEmail;
            existingInvoice.dispatchThrough = dispatchThrough || existingInvoice.dispatchThrough;
            existingInvoice.customerAadhar = customerAadhar || existingInvoice.customerAadhar;

              // Replace whole arrays if provided
    if (productDetails) {
        existingInvoice.productDetails = productDetails;
      }
      if (amountDetails) {
        existingInvoice.amountDetails = amountDetails;
      }
      await existingInvoice.save();
      return res.status(200).json({
        message: "Invoice updated successfully",
        success: true,
        data:existingInvoice
      })
    } catch (error) {
        console.log('Error updating invoice', error);
        return res.status(500).json({
            message:'Error updating invoice',
            error:error
        })
    }
}
exports.deleteInvoice=async(req,res)=>{
    try {
  
        const invoice=await InvoiceForm.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ error: "Invoice not found" });

        }
        await InvoiceForm.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: "Invoice deleted successfully",
            success: true
        })
    } catch (error) {
        console.log('Error while deleting invoice', error);
        return res.status(500).json({
            message:'Error while deleting invoice',
            error:error,
            success:false
        })
    }
}
exports.getallInvoice=async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate how many documents to skip
        const skip = (page - 1) * limit;
        const invoices = await InvoiceForm.find().skip(skip).limit(limit).sort({ createdAt: -1});
        const total = await InvoiceForm.countDocuments();
        if(!invoices && invoices.length===0){
            return res.status(404).json({
                message:'No inoice found !',
                success:false,
            })
        }
      res.status(200).json({
            message: "Invoices fetched successfully",
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProducts: total,
            data: invoices
        })
    } catch (error) {
res.status(500).json({
    message:'Internal server error',
    error:error,
    success:false
})
    }
}
exports.searchInvoice=async(req,res)=>{
    try {
      const search = req.query.q;
      if(!search){
        return res.status(404).json({
            message:'search query required',
            success:false
        })
      }
      const invoices=await InvoiceForm.find({
        $or: [
            {invoiceNumber:{$regex:search,$options:'i'}}
           
        ]
      });
      if(!invoices && invoices.length===0){
        return res.status(404).json({
            message:'Not Found',
            success:false
        })
      }
      return res.status(200).json({
        message: "Invoices fetched successfully",
        success:true,
        data: invoices
      })
    } catch (error) {
           res.status(500).json({
            message:'Internal server error',
            error:error,
            success:false
           })
    }
}
exports.getInvoiceById = async (req, res) => {
    try {
        // Extract invoice ID from request parameters
        const { id } = req.params;

        // Find the invoice by ID
        const invoice = await InvoiceForm.findById(id);
        
        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Invoice fetched successfully",
            success: true,
            data: invoice
        });
    } catch (error) {
        console.log('Error fetching invoice', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            success: false
        });
    }
};
