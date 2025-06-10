const express = require('express');
const {
    addCar,
    deleteCar,
    updateCar,
    getCars,
    getCarById,
} = require('../controllers/carsController');
const router = express.Router();

router.post('/add', addCar);
router.delete('/delete/:id', deleteCar);
router.put('/update/:id', updateCar);
router.get('/all', getCars);
router.get('/mano/:id', getCarById);

module.exports = router;