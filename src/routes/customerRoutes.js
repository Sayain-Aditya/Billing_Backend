const express = require('express');
const {addCustomer, getAllCustomer, deleteCustomer, updateCustomer, getCustomerId} = require('../controllers/customerController');

const route = express.Router();

route.post('/add', addCustomer)
route.get('/mono/:id', getCustomerId)
route.get('/all', getAllCustomer)
route.delete('/delete/:id', deleteCustomer)
route.put('/update/:id', updateCustomer)


module.exports = route;