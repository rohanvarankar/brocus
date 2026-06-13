const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Checkout and create an order
// @route   POST /api/checkout
// @access  Private
const checkout = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const userId = req.user._id;

    // 1. Get user cart
    const cartItems = await Cart.find({ userId }).populate('productId').session(session);

    // 2. Verify cart not empty
    if (!cartItems || cartItems.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let totalPrice = 0;
    const orderItems = [];

    // 3. Verify stock and calculate total price
    for (const item of cartItems) {
      const product = item.productId;
      
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: 'Product in cart not found or was deleted' });
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.title}. Only ${product.stock} left.` });
      }

      totalPrice += product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        title: product.title,
        imageUrl: product.imageUrl,
        quantity: item.quantity,
        price: product.price
      });
    }

    // 4. Create Order Records
    const order = new Order({
      userId,
      items: orderItems,
      totalPrice,
      status: 'Pending',
    });

    const savedOrder = await order.save({ session });

    // 5. Reduce product stock
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(
        item.productId._id, 
        { $inc: { stock: -item.quantity } },
        { session, new: true }
      );
    }

    // 6. Clear Cart
    await Cart.deleteMany({ userId }).session(session);

    await session.commitTransaction();
    session.endSession();

    // Populate the newly created order for response summary (populate not strictly necessary anymore but good for format)
    const populatedOrder = await Order.findById(savedOrder._id).populate('items.productId');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder || savedOrder
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    // Fallback if transactions are not supported on local standalone MongoDB
    if (error.message.includes('Transaction') || error.message.includes('replica set')) {
      console.warn('Transactions not supported on this DB deployment. Please use MongoDB Atlas. Proceeding without transaction (Not recommended for Prod).');
      return checkoutFallback(req, res);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fallback for non-replica set local dev environments
const checkoutFallback = async (req, res) => {
  try {
    const userId = req.user._id;
    const cartItems = await Cart.find({ userId }).populate('productId');
    if (!cartItems || cartItems.length === 0) return res.status(400).json({ success: false, message: 'Cart is empty' });

    let totalPrice = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const product = item.productId;
      if (!product) return res.status(400).json({ success: false, message: 'Product in cart not found' });
      if (product.stock < item.quantity) return res.status(400).json({ success: false, message: `Insufficient stock for ${product.title}` });

      totalPrice += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        title: product.title,
        imageUrl: product.imageUrl,
        quantity: item.quantity,
        price: product.price
      });
    }

    const order = new Order({ userId, items: orderItems, totalPrice, status: 'Pending' });
    const savedOrder = await order.save();

    for (const item of cartItems) {
      await Product.findByIdAndUpdate(item.productId._id, { $inc: { stock: -item.quantity } });
    }

    await Cart.deleteMany({ userId });

    res.status(201).json({
      success: true,
      message: 'Order created successfully (Fallback Mode)',
      data: savedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('items.productId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'All orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:orderId/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  checkout,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
