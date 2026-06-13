const Product = require('../models/Product');

// @desc    Get all products (with optional search, category filter, and pagination)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 8, minPrice, maxPrice, inStockOnly } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All' && category !== '') {
      query.category = category;
    }

    if (minPrice !== undefined && minPrice !== '') {
      const minPriceNum = Number(minPrice);
      if (!isNaN(minPriceNum)) {
        query.price = { ...query.price, $gte: minPriceNum };
      }
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      const maxPriceNum = Number(maxPrice);
      if (!isNaN(maxPriceNum)) {
        query.price = { ...query.price, $lte: maxPriceNum };
      }
    }

    if (inStockOnly === 'true' || inStockOnly === true) {
      query.stock = { $gt: 0 };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitNum);

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products,
        currentPage: pageNum,
        totalPages: totalPages || 1,
        totalProducts,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all distinct product categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json({
        success: true,
        message: 'Product retrieved successfully',
        data: product
      });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const { title, description, imageUrl, price, category, stock } = req.body;

    if (!title || !description || !imageUrl || price === undefined || !category || stock === undefined) {
      return res.status(400).json({ success: false, message: 'All product fields are required' });
    }

    if (Number(price) < 0) {
      return res.status(400).json({ success: false, message: 'Price cannot be negative' });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({ success: false, message: 'Stock cannot be negative' });
    }

    const product = new Product({
      title,
      description,
      imageUrl,
      price: Number(price),
      category,
      stock: Number(stock),
    });

    const createdProduct = await product.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: createdProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const { title, description, imageUrl, price, category, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      if (title !== undefined) product.title = title;
      if (description !== undefined) product.description = description;
      if (imageUrl !== undefined) product.imageUrl = imageUrl;
      if (price !== undefined) {
        if (Number(price) < 0) return res.status(400).json({ success: false, message: 'Price cannot be negative' });
        product.price = Number(price);
      }
      if (category !== undefined) product.category = category;
      if (stock !== undefined) {
        if (Number(stock) < 0) return res.status(400).json({ success: false, message: 'Stock cannot be negative' });
        product.stock = Number(stock);
      }

      const updatedProduct = await product.save();
      res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({
        success: true,
        message: 'Product removed successfully',
        data: null
      });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
