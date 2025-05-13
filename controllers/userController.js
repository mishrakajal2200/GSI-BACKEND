// import User from "../models/User.js";
// import jwt from "jsonwebtoken";

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
// };

// // 🔐 Register Controller
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ message: "User already exists" });

//     const user = await User.create({ name, email, password });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error during registration" });
//   }
// };

// // 🔑 Login Controller
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (user && (await user.matchPassword(password))) {
//       res.status(200).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(401).json({ message: "Invalid email or password" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Server error during login" });
//   }
// };


// // controllers/userController.js
// import User from '../models/User.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// // @desc    Register a new user
// // @route   POST /api/register
// // @access  Public
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Validate input
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'Please fill in all fields' });
//     }

//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({ message: 'User with this email already exists' });
//     }

//     // Manually hash the password using bcrypt in the controller
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const user = new User({
//       name,
//       email,
//       password: hashedPassword, // Save the manually hashed password
//     });

//     const createdUser = await user.save();

//     if (createdUser) {
//       // Generate token
//       const token = jwt.sign(
//         { userId: createdUser._id, role: createdUser.role },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' }
//       );

//       res.status(201).json({
//         _id: createdUser._id,
//         name: createdUser.name,
//         email: createdUser.email,
//         role: createdUser.role,
//         token,
//       });
//     } else {
//       res.status(400).json({ message: 'Invalid user data' });
//     }
//   } catch (error) {
//     console.error('Error in registerUser:', error);
//     res.status(500).json({ message: 'Server error during registration' });
//   }
// };



// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email }).select('+password');
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // Generate token
//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     // Respond with user data (excluding password)
//     res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       address: user.address,
//       role: user.role,
//       avatar: user.avatar,
//       token,
//     });
//   } catch (err) {
//     console.error('Error in loginUser:', err);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// };

// // @desc    Get user's wishlist
// // @route   GET /api/wishlist
// // @access  Private (Authenticated User)
// export const getUserWishlist = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate('wishlist', 'name image price _id'); // Populate wishlist with product details
//     if (user) {
//       res.json(user.wishlist);
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     console.error('Error in getUserWishlist:', error);
//     res.status(500).json({ message: 'Server error fetching wishlist' });
//   }
// };

// // @desc    Add product to user's wishlist
// // @route   POST /api/wishlist/:productId
// // @access  Private (Authenticated User)
// export const addToWishlist = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { productId } = req.params;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (user.wishlist.includes(productId)) {
//       return res.status(400).json({ message: 'Product already in wishlist' });
//     }

//     user.wishlist.push(productId);
//     await user.save();

//     res.status(200).json({ message: 'Product added to wishlist' });
//   } catch (error) {
//     console.error('Error in addToWishlist:', error);
//     res.status(500).json({ message: 'Server error adding to wishlist' });
//   }
// };

// // @desc    Remove product from user's wishlist
// // @route   DELETE /api/wishlist/:productId
// // @access  Private (Authenticated User)
// export const removeFromWishlist = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { productId } = req.params;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
//     await user.save();

//     res.status(200).json({ message: 'Product removed from wishlist' });
//   } catch (error) {
//     console.error('Error in removeFromWishlist:', error);
//     res.status(500).json({ message: 'Server error removing from wishlist' });
//   }
// };



// export const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// // PUT /api/users/profile
// export const updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const { name, phone, address } = req.body;

//     if (name) user.name = name;
//     if (phone) user.phone = phone;
//     if (address) {
//       user.address = {
//         ...user.address,
//         ...address // merge updates
//       };
//     }

//     const updatedUser = await user.save();
//     res.status(200).json({
//       name: updatedUser.name,
//       email: updatedUser.email,
//       phone: updatedUser.phone,
//       address: updatedUser.address,
//       avatar: updatedUser.avatar
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Update failed', error: err.message });
//   }
// };



import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// Signup
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Checkout Details (Address and Phone)
export const updateCheckoutDetails = async (req, res) => {
  const { address, phone } = req.body;

  if (!address || !phone) {
    return res.status(400).json({ message: 'Address and phone are required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.address = address;
    user.phone = phone;
    await user.save();

    res.status(200).json({ message: 'Checkout details updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    // Find the user by their ID (from the token)
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (phone) user.phone = phone;

    // If password is provided, hash it and update it
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


// export const contactFormHandler = async (req, res) => {
//   const { name, email, subject, message } = req.body;

//   if (!name || !email || !subject || !message) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   const mailContent = {
//     from: email,
//     subject: `Contact Form: ${subject}`,
//     text: `You have a new message from ${name} (${email}):\n\n${message}`,
//   };

//   try {
//     const info = await sendMail(mailContent);
//     res.status(200).json({ message: 'Message sent successfully', info });
//   } catch (error) {
//     res.status(500).json({ message: 'Error sending message', error: error.toString() });
//   }
// };