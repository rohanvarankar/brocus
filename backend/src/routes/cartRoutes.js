const express = require('express');
const router = express.Router();
const { protect, customerOnly } = require('../middleware/authMiddleware');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');

router.use(protect, customerOnly);

router.post('/', addToCart);
router.get('/', getCart);
router.delete('/clear', clearCart);
router.put('/:id', updateCartItem);
router.delete('/:id', removeCartItem);

module.exports = router;
