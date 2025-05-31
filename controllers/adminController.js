// // controllers/adminController.js
// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';

// // export const adminLogin = async (req, res) => {
// //   const { email, password } = req.body;

// //   try {
// //     // Find user by email
// //     const user = await User.findOne({ email });

// //     // Check if user exists and is admin
// //     if (!user || user.role !== 'admin') {
// //       return res.status(401).json({ message: 'Invalid credentials or not admin' });
// //     }

// //     // Compare password using your model method
// //     const isMatch = await user.matchPassword(password);
// //     if (!isMatch) {
// //       return res.status(401).json({ message: 'Invalid credentials' });
// //     }

// //     // Generate JWT token
// //     const token = jwt.sign(
// //       { userId: user._id, role: user.role },
// //       process.env.JWT_SECRET || 'your_jwt_secret',
// //       { expiresIn: '1d' }
// //     );

// //     res.status(200).json({
// //       message: 'Admin login successful',
// //       token:token || 'no_token',
// //       role: user.role,
// //       name: user.name,
// //       email: user.email,
// //     });
// //   } catch (error) {
// //     console.error('Admin login error:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// export const adminLogin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(200).json({
//       message: 'Login successful',
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       },
//       token,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const getAdminStats = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const activeUsers = await User.countDocuments({ isActive: true }); // Add logic as per your schema
//     const totalOrders = await Order.countDocuments();
//     const totalRevenue = await Order.aggregate([
//       { $match: { isPaid: true } },
//       { $group: { _id: null, total: { $sum: "$totalPrice" } } }
//     ]);

//     res.status(200).json({
//       totalUsers,
//       activeUsers,
//       totalOrders,
//       totalRevenue: totalRevenue[0]?.total || 0,
//     });
//   } catch (error) {
//     console.error('Failed to fetch admin stats:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };