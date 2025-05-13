import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/orderModel.js'; // ✅ Now this exists
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const getAdminStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const orders = await Order.find();

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.status(200).json({
      users,
      products,
      orders: orders.length,
      revenue: totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// export const adminSignup = async (req, res) => {
//     const { name, email, password } = req.body;
  
//     try {
//       // Check if admin email already exists
//       const existingUser = await User.findOne({ email });
  
//       if (existingUser) {
//         return res.status(400).json({ message: 'User already exists' });
//       }
  
//       // Create a new admin user
//       const newUser = new User({
//         name,
//         email,
//         password,
//         role: 'admin', // Ensure this is set to admin
//       });
  
//       // Hash password before saving
//       const salt = await bcrypt.genSalt(10);
//       newUser.password = await bcrypt.hash(password, salt);
  
//       await newUser.save();
  
//       // Generate JWT token
//       const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
//       res.status(201).json({
//         message: 'Admin registered successfully',
//         token,
//       });
//     } catch (error) {
//       console.error('Admin Signup Error:', error);  // Log full error details
//       res.status(500).json({ message: 'Server error', error: error.message || error });
//     }
//   };
  




export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  // Hardcode the admin user credentials (if no signup process is needed)
  const correctAdminEmail = 'admin@example.com';
  const correctAdminPassword = 'admin123';

  try {
    // Debugging: Log the email and password coming from the request
    console.log("🔐 Login attempt:", email);
    console.log("🔑 Entered password:", password);

    // Check if the login email matches the hardcoded admin email
    if (email !== correctAdminEmail) {
      console.log("❌ Email does not match hardcoded admin email");
      return res.status(400).json({ message: 'User not found' });
    }

    // Hash the correct admin password to compare
    const hashedCorrectPassword = await bcrypt.hash(correctAdminPassword, 10);
    console.log("📂 Hashed correct password:", hashedCorrectPassword);

    // Compare entered password with the hardcoded hashed password
    const isMatch = await bcrypt.compare(password, hashedCorrectPassword);
    console.log("🔍 Password match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Invalid credentials (password mismatch)");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: correctAdminEmail, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("📝 JWT Token generated successfully");

    res.status(200).json({
      message: 'Admin logged in successfully',
      token,
    });

  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};
