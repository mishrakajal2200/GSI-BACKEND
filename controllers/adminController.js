// controllers/adminController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// export const adminLogin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find user by email
//     const user = await User.findOne({ email });

//     // Check if user exists and is admin
//     if (!user || user.role !== 'admin') {
//       return res.status(401).json({ message: 'Invalid credentials or not admin' });
//     }

//     // Compare password using your model method
//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET || 'your_jwt_secret',
//       { expiresIn: '1d' }
//     );

//     res.status(200).json({
//       message: 'Admin login successful',
//       token:token || 'no_token',
//       role: user.role,
//       name: user.name,
//       email: user.email,
//     });
//   } catch (error) {
//     console.error('Admin login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const adminLogin = async (req, res) => {

//   console.log("🔥 adminLogin controller HIT");

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
export const adminLogin = async (req, res) => {
  console.log("🔥 adminLogin controller HIT");

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ No user found");
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== "admin") {
      console.log("❌ Not an admin");
      return res.status(401).json({ message: "Access Denied: Not an admin" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("❌ Password does not match");
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("🔥 Server Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// export const getAdminStats = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const activeUsers = await User.countDocuments({ isActive: true });

//     const totalOrders = await Order.countDocuments();

//     const totalRevenue = await Order.aggregate([
//       { $match: { isPaid: true } },
//       { $group: { _id: null, total: { $sum: "$totalPrice" } } },
//     ]);

//     res.status(200).json({
//       totalUsers,
//       activeUsers,
//       totalOrders,
//       totalRevenue: totalRevenue[0]?.total || 0,
//     });
//   } catch (error) {
//     console.error('❌ Failed to fetch admin stats:', error.message);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
export const getAdminStats = async (req, res) => {
  try {

    const activeUsers = await User.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();

    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    res.status(200).json({
      activeUsers,
      totalOrders,
      totalSales: totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    console.error('Failed to fetch admin stats', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// recent orders
export const getRecentOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // adjust as needed
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email"); // optional: if you want to show customer info

    const formattedOrders = orders.map((order) => ({
      id: order._id,
      customer: order.user?.name || "Unknown",
      status: order.status,
      amount: order.totalPrice,
    }));

    res.json({
      orders: formattedOrders,
      hasMore: skip + limit < totalOrders,
    });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      mainCategory,
      subCategory,
      subSubCategory,
      price,
      mrp,
      description,
    } = req.body;

    const image = req.file?.path;

    if (!name || !price || !mrp || !brand || !image) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const newProduct = new Product({
      name,
      brand,
      mainCategory,
      subCategory,
      subSubCategory,
      price,
      mrp,
      description,
      image,
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    console.error('Error creating product:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export { createProduct };
