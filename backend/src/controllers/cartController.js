const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to format cart response
const formatCartResponse = async (userId) => {
  const cartItems = await Cart.find({ userId }).populate('productId');
  
  let totalItems = 0;
  let totalPrice = 0;

  // Filter out any cart items where the product was deleted
  const validItems = [];
  for (const item of cartItems) {
    if (item.productId) {
      totalItems += item.quantity;
      totalPrice += item.productId.price * item.quantity;
      validItems.push(item);
    }
  }

  return {
    items: validItems,
    totalItems,
    totalPrice
  };
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }
    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: `Insufficient stock. Only ${product.stock} items left.` });
    }

    let cartItem = await Cart.findOne({ userId: req.user._id, productId });

    if (cartItem) {
      // Check if new total quantity exceeds stock
      if (product.stock < (cartItem.quantity + Number(quantity))) {
         return res.status(400).json({ success: false, message: `Cannot add more. Insufficient stock.` });
      }
      cartItem.quantity += Number(quantity);
      await cartItem.save();
    } else {
      await Cart.create({
        userId: req.user._id,
        productId,
        quantity: Number(quantity)
      });
    }

    const cartData = await formatCartResponse(req.user._id);

    res.status(200).json({ 
      success: true, 
      message: 'Item added to cart',
      ...cartData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cartData = await formatCartResponse(req.user._id);
    res.status(200).json({ 
      success: true, 
      message: 'Cart retrieved successfully',
      ...cartData 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (Number(quantity) < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    // First find the cart item to know which product it is
    const existingItem = await Cart.findOne({ _id: req.params.id, userId: req.user._id }).populate('productId');
    
    if (!existingItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found or unauthorized' });
    }

    if (!existingItem.productId || existingItem.productId.stock < Number(quantity)) {
      return res.status(400).json({ success: false, message: 'Insufficient stock for this quantity' });
    }

    existingItem.quantity = Number(quantity);
    await existingItem.save();

    const cartData = await formatCartResponse(req.user._id);

    res.status(200).json({ 
      success: true, 
      message: 'Cart updated successfully',
      ...cartData 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found or unauthorized' });
    }
    
    const cartData = await formatCartResponse(req.user._id);

    res.status(200).json({ 
      success: true, 
      message: 'Item removed from cart',
      ...cartData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user._id });
    const cartData = await formatCartResponse(req.user._id);

    res.status(200).json({ 
      success: true, 
      message: 'Cart cleared successfully',
      ...cartData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
