const express = require('express');
const router = express.Router();

// ✅ Destructure all handlers from the controller
const {
  createIternary,
  getAllIternaries,
  getIternaryById,
  updateIternary,
  deleteIternary
} = require('../controllers/IternaryController');

router.post('/add', createIternary);
router.get('/all', getAllIternaries);
router.get('/mano/:id', getIternaryById);
router.put('/update/:id', updateIternary);
router.delete('/delete/:id', deleteIternary);

module.exports = router;
