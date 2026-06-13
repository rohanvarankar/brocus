const express = require('express');
const router = express.Router();
const { protect, customerOnly } = require('../middleware/authMiddleware');
const { checkout } = require('../controllers/orderController');

router.post('/', protect, customerOnly, checkout);

module.exports = router;
