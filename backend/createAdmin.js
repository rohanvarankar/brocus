const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brocus');
    
    const email = "admin@brocus.com";
    const plainPassword = "Admin123";
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    
    // Update or create the admin user
    const user = await User.findOneAndUpdate(
      { email },
      { 
        name: "Admin",
        password: hashedPassword,
        role: "admin"
      },
      { new: true, upsert: true }
    );
    
    console.log(`✅ Admin account configured successfully!`);
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${plainPassword}`);
    console.log(`You can now log in.`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
