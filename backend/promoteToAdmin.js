const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const email = process.argv[2];

if (!email) {
  console.log("Usage: node promoteToAdmin.js <user-email>");
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brocus')
  .then(async () => {
    const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
    if (user) {
      console.log(`✅ Successfully promoted ${user.email} to Admin!`);
      console.log(`You can now log in with this email to access the Admin Dashboard.`);
    } else {
      console.log(`❌ User with email ${email} not found. Please sign up first.`);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
