const express = require('express');
const router = express.Router();
const {createInvoice,updateInvoice, deleteInvoice, getallInvoice, searchInvoice, getInvoiceById}=require('../controllers/invoiceformController');
router.get('/all',getallInvoice)
router.get('/mono/:id',getInvoiceById)
router.post('/create', createInvoice);
router.put('/update/:id', updateInvoice);
router.delete('/delete/:id',deleteInvoice)
router.get('/search',searchInvoice)
module.exports = router;