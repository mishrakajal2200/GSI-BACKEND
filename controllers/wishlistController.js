// import User from '../models/User.js';
// import Product from '../models/Product.js';


// // Add to Wishlist
// // export const addToWishlist = async (req, res) => {
// //   try {
// //     const { productId } = req.body;

// //     // ✅ Check if product exists
// //     const product = await Product.findById(productId);
// //     if (!product) {
// //       return res.status(404).json({ message: 'Product not found' });
// //     }

// //     const user = await User.findById(req.user._id);

// //     // ✅ Check if product is already in wishlist
// //     if (user.wishlist.includes(productId)) {
// //       return res.status(400).json({ message: 'Product already in wishlist' });
// //     }

// //     user.wishlist.push(productId);
// //     await user.save();

// //     res.status(200).json({ wishlist: user.wishlist });
// //   } catch (err) {
// //     console.error('Add to wishlist error:', err.message);
// //     res.status(500).json({ message: 'Server error', error: err.message });
// //   }
// // };

// export const addToWishlist = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     const userId = req.user.id;

//     // ✅ Find the product
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // ✅ Find the user
//     const user = await User.findById(userId);
//     if (!Array.isArray(user.wishlist)) {
//       user.wishlist = [];
//     }

//     // ✅ Check if product already exists in wishlist
//     const existingItem = user.wishlist.find(
//       (item) => item.productId?.toString() === productId
//     );

//     if (existingItem) {
//       return res.status(400).json({ message: 'Product already in wishlist' });
//     }

//     // ✅ Add product details to wishlist
//     user.wishlist.push({
//       productId,
//       name: product.name,
//       image: product.image,
//       price: product.price
//     });

//     await user.save();

//     // ✅ Respond with updated wishlist
//     res.status(200).json({ wishlist: user.wishlist });
//   } catch (err) {
//     console.error('Add to wishlist error:', err.message);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };


// // Remove from wishlist
// // export const removeFromWishlist = async (req, res) => {
// //   try {
// //     const { productId } = req.params;
// //     const user = await User.findById(req.user._id);

// //     user.wishlist = user.wishlist.filter(
// //       (id) => id.toString() !== productId
// //     );

// //     await user.save();
// //     res.status(200).json({ wishlist: user.wishlist });
// //   } catch (err) {
// //     res.status(500).json({ message: "Server error", error: err.message });
// //   }
// // };
// export const removeFromWishlist = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     if (!productId) {
//       return res.status(400).json({ message: "Product ID is required" });
//     }

//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Find the index of the item to remove
//     const itemIndex = user.wishlist.findIndex(
//       (item) => item.productId?.toString() === productId
//     );

//     if (itemIndex === -1) {
//       return res.status(404).json({ message: "Item not found in wishlist" });
//     }

//     // Remove item from wishlist
//     user.wishlist.splice(itemIndex, 1);
//     await user.save();

//     // Re-fetch with populated data if needed
//     const updatedUser = await User.findById(req.user._id).populate({
//       path: 'wishlist.productId',
//       select: 'name price image',
//     });

//     const wishlistItems = updatedUser.wishlist.map(item => {
//       if (item.productId && item.productId._id) {
//         return {
//           productId: item.productId._id,
//           name: item.productId.name,
//           price: item.productId.price,
//           image: item.productId.image,
//         };
//       }
//       return null;
//     }).filter(Boolean);

//     res.status(200).json({ wishlist: wishlistItems });

//   } catch (err) {
//     console.error("Error removing item from wishlist:", err.message);
//     res.status(500).json({ message: "Error removing item from wishlist" });
//   }
// };


// // Get wishlist
// // export const getWishlist = async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user._id).populate('wishlist');
// //     res.status(200).json({ wishlist: user.wishlist });
// //   } catch (err) {
// //     res.status(500).json({ message: "Server error", error: err.message });
// //   }
// // };


// export const getWishlist = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate({
//       path: 'wishlist.productId',
//       select: 'name price image', // Only these fields from Product
//     });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const wishlistItems = (user.wishlist || []).reduce((acc, item) => {
//       if (
//         item.productId &&
//         item.productId._id &&
//         mongoose.Types.ObjectId.isValid(item.productId._id)
//       ) {
//         acc.push({
//           productId: item.productId._id,
//           name: item.productId.name,
//           price: item.productId.price,
//           image: item.productId.image,
//         });
//       }
//       return acc;
//     }, []);

//     res.status(200).json({ wishlist: wishlistItems });

//   } catch (err) {
//     console.error("❌ Error fetching wishlist:", err.message);
//     res.status(500).json({ message: 'Internal server error while fetching wishlist' });
//   }
// };

// // move to cart
// // Move item from wishlist to cart
// // export const moveToCart = async (req, res) => {
// //   try {
// //     const { productId } = req.body;

// //     const user = await User.findById(req.user._id);

// //     // ✅ Remove from wishlist
// //     user.wishlist = user.wishlist.filter(
// //       (id) => id.toString() !== productId
// //     );

// //     // ✅ Check if item already in cart
// //     const existingCartItem = user.cart.find(
// //       (item) => item.product.toString() === productId
// //     );

// //     if (existingCartItem) {
// //       existingCartItem.quantity += 1;
// //     } else {
// //       user.cart.push({ product: productId, quantity: 1 });
// //     }

// //     await user.save();

// //     res.status(200).json({
// //       message: 'Moved to cart successfully',
// //       wishlist: user.wishlist,
// //       cart: user.cart,
// //     });
// //   } catch (err) {
// //     console.error('Move to cart error:', err.message);
// //     res.status(500).json({ message: 'Server error', error: err.message });
// //   }
// // };


// export const moveToCart = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { productId } = req.params; // ✅ Get productId from URL params

//     if (!productId) {
//       return res.status(400).json({ message: 'Product ID is required' });
//     }

//     const user = await User.findById(userId);

//     // ✅ Remove from wishlist
//     user.wishlist.pull(productId);

//     // ✅ Check if product already exists in cart
//     const existingCartItem = user.cart.find(item =>
//       item.productId?.toString() === productId.toString()
//     );
    

//     if (existingCartItem) {
//       existingCartItem.quantity += 1;
//     } else {
//       user.cart.push({ productId: productId, quantity: 1 });
//     }

//     await user.save();

//     // ✅ Populate wishlist and cart.productId
//     const updatedUser = await User.findById(userId)
//       .populate('wishlist')
//       .populate('cart.productId');

//     res.status(200).json({
//       message: 'Moved to cart',
//       wishlist: updatedUser.wishlist,
//       cart: updatedUser.cart,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };






import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';

// Add to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Find product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const user = await User.findById(userId);
    if (!user.wishlist) user.wishlist = [];

    // Check if product already in wishlist
    const exists = user.wishlist.some(
      (item) => item.productId?.toString() === productId
    );
    if (exists) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add product details to wishlist
    user.wishlist.push({
      productId,
      name: product.name,
      image: product.image,
      price: product.price,
    });

    await user.save();

    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error('Add to wishlist error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Remove from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) return res.status(400).json({ message: 'Product ID is required' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const itemIndex = user.wishlist.findIndex(
      (item) => item.productId?.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    user.wishlist.splice(itemIndex, 1);
    await user.save();

    // Populate for frontend response
    const updatedUser = await User.findById(req.user._id).populate({
      path: 'wishlist.productId',
      select: 'name price image',
    });

    const wishlistItems = updatedUser.wishlist.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
    }));

    res.status(200).json({ wishlist: wishlistItems });
  } catch (err) {
    console.error('Remove from wishlist error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist.productId',
      select: 'name price image',
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const wishlistItems = (user.wishlist || []).map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
    }));

    res.status(200).json({ wishlist: wishlistItems });
  } catch (err) {
    console.error('Get wishlist error:', err.message);
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
