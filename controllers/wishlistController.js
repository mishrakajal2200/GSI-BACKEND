
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';

// Add to Wishlist
// export const addToWishlist = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     const userId = req.user._id;

//     // Find product
//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     const user = await User.findById(userId);
//     if (!user.wishlist) user.wishlist = [];

//     // Check if product already in wishlist
//     const exists = user.wishlist.some(
//       (item) => item.productId?.toString() === productId
//     );
//     if (exists) {
//       return res.status(400).json({ message: 'Product already in wishlist' });
//     }

//     // Add product details to wishlist
//     user.wishlist.push({
//       productId,
//       name: product.name,
//       image: product.image,
//       price: product.price,
//     });

//     await user.save();

//     res.status(200).json({ wishlist: user.wishlist });
//   } catch (err) {
//     console.error('Add to wishlist error:', err.message);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };
export const addToWishlist = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(userId);

    // Initialize wishlist array if undefined
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Check if product already in wishlist
    const exists = user.wishlist.some(
      (item) => item.toString() === productId
    );
    if (exists) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Push only the productId
    user.wishlist.push(productId);

    await user.save();

    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error('Add to wishlist error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// Remove from Wishlist
// export const removeFromWishlist = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     if (!productId) return res.status(400).json({ message: 'Product ID is required' });

//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const itemIndex = user.wishlist.findIndex(
//       (item) => item.productId?.toString() === productId
//     );

//     if (itemIndex === -1) {
//       return res.status(404).json({ message: 'Item not found in wishlist' });
//     }

//     user.wishlist.splice(itemIndex, 1);
//     await user.save();

//     // Populate for frontend response
//     const updatedUser = await User.findById(req.user._id).populate({
//       path: 'wishlist.productId',
//       select: 'name price image',
//     });

//     const wishlistItems = updatedUser.wishlist.map(item => ({
//       productId: item.productId._id,
//       name: item.productId.name,
//       price: item.productId.price,
//       image: item.productId.image,
//     }));

//     res.status(200).json({ wishlist: wishlistItems });
//   } catch (err) {
//     console.error('Remove from wishlist error:', err.message);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };
const removeFromWishlist = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`https://gsi-backend-1.onrender.com/api/wishlist/remove/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchWishlist(); // refresh the wishlist
  } catch (err) {
    console.error('Error removing from wishlist:', err);
  }
};

// Get Wishlist
// export const getWishlist = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate({
//       path: 'wishlist.productId',
//       select: 'name price image',
//     });

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const wishlistItems = (user.wishlist || []).map(item => ({
//       productId: item.productId._id,
//       name: item.productId.name,
//       price: item.productId.price,
//       image: item.productId.image,
//     }));

//     res.status(200).json({ wishlist: wishlistItems });
//   } catch (err) {
//     console.error('Get wishlist error:', err.message);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Move to Cart
export const moveToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!productId) return res.status(400).json({ message: 'Product ID is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(
      (item) => item.productId?.toString() !== productId
    );

    // Check if product in cart
    const existingCartItem = user.cart.find(
      (item) => item.productId?.toString() === productId
    );

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }

    await user.save();

    // Populate wishlist and cart for response
    const updatedUser = await User.findById(userId)
      .populate({
        path: 'wishlist.productId',
        select: 'name price image',
      })
      .populate({
        path: 'cart.productId',
        select: 'name price image',
      });

    const wishlistItems = updatedUser.wishlist.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
    }));

    const cartItems = updatedUser.cart.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      quantity: item.quantity,
    }));

    res.status(200).json({
      message: 'Moved to cart successfully',
      wishlist: wishlistItems,
      cart: cartItems,
    });
  } catch (err) {
    console.error('Move to cart error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
