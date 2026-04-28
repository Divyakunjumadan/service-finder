require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedAdmin = async () => {
  await connectDB();

  const adminEmail = 'admin@servicefinder.com';
  const existing = await User.findOne({ email: adminEmail });

  if (existing) {
    console.log('✅ Admin already exists:', adminEmail);
    process.exit(0);
  }

  await User.create({
    name: 'System Admin',
    email: adminEmail,
    password: 'Admin@123',
    role: 'admin',
    phone: '0000000000',
    address: 'Admin HQ',
    location: 'Global'
  });

  console.log('✅ Admin seeded successfully!');
  console.log('   Email: admin@servicefinder.com');
  console.log('   Password: Admin@123');
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
