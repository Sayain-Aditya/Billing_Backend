const express = require('express');
const {addCustomer, getAllCustomer} = require('../controllers/customerController');

const route = express.Router();

route.post('/add', addCustomer)
route.get('/all', getAllCustomer)

module.exports = route;