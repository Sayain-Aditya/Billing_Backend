const express = require('express');
const router = express.Router();
const {createInvoice,updateInvoice, deleteInvoice, getallInvoice, searchInvoice, getInvoiceById, getNextInvoiceNumber}=require('../controllers/invoiceformController');
router.get('/all',getallInvoice)
router.get('/mono/:id',getInvoiceById)
router.post('/create', createInvoice);
router.put('/update/:id', updateInvoice);
router.delete('/delete/:id',deleteInvoice)
router.get('/search',searchInvoice)
router.get('/next-invoice-number', getNextInvoiceNumber)
module.exports = router;