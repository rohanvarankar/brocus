const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

router.use(protect);

router.get('/my-orders', getMyOrders);
router.get('/', admin, getAllOrders);
router.patch('/:orderId/status', admin, updateOrderStatus);

module.exports = router;
