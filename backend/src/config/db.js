const mongoose = require('mongoose');
const Product = require('../models/Product');

const seedDemoProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const demoProducts = [
        {
          title: "Premium Wireless Headphones",
          description: "Active noise cancelling wireless over-ear headphones with superior audio clarity and 30-hour battery life.",
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
          price: 199.99,
          category: "Electronics",
          stock: 15
        },
        {
          title: "Minimalist Leather Backpack",
          description: "Water-resistant commuter backpack crafted from full-grain leather. Comfortably fits a 15-inch laptop.",
          imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
          price: 129.50,
          category: "Clothing",
          stock: 8
        },
        {
          title: "Mechanical Gaming Keyboard",
          description: "Tenkeyless mechanical keyboard featuring tactile brown switches, dynamic RGB backlighting, and aluminum frame.",
          imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80",
          price: 89.99,
          category: "Electronics",
          stock: 12
        },
        {
          title: "Ceramic Coffee Dripper Set",
          description: "Pour-over coffee maker set including a white matte ceramic dripper, glass server, and solid wood base stand.",
          imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
          price: 45.00,
          category: "Home & Kitchen",
          stock: 20
        },
        {
          title: "Nordic Ceramic Flower Vase",
          description: "Elegant, textured ceramic vase perfect for dried flowers or minimal tabletop decor in living and workspace settings.",
          imageUrl: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=600&q=80",
          price: 24.99,
          category: "Home & Kitchen",
          stock: 4
        },
        {
          title: "Smart Sports Fitness Band",
          description: "Waterproof fitness band with automatic sleep tracking, continuous heart rate monitoring, and 14-day battery run-time.",
          imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=600&q=80",
          price: 59.99,
          category: "Fitness & Outdoors",
          stock: 3
        }
      ];
      await Product.insertMany(demoProducts);
      console.log('Database successfully seeded with 6 demo products.');
    }
  } catch (error) {
    console.error(`Failed to seed database: ${error.message}`);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/brocus');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDemoProducts();
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
