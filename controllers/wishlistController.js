import User from '../models/User.js';
import Product from '../models/Product.js';


// Add to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // ✅ Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);

    // ✅ Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error('Add to wishlist error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();
    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// move to cart
// Move item from wishlist to cart
// export const moveToCart = async (req, res) => {
//   try {
//     const { productId } = req.body;

//     const user = await User.findById(req.user._id);

//     // ✅ Remove from wishlist
//     user.wishlist = user.wishlist.filter(
//       (id) => id.toString() !== productId
//     );

//     // ✅ Check if item already in cart
//     const existingCartItem = user.cart.find(
//       (item) => item.product.toString() === productId
//     );

//     if (existingCartItem) {
//       existingCartItem.quantity += 1;
//     } else {
//       user.cart.push({ product: productId, quantity: 1 });
//     }

//     await user.save();

//     res.status(200).json({
//       message: 'Moved to cart successfully',
//       wishlist: user.wishlist,
//       cart: user.cart,
//     });
//   } catch (err) {
//     console.error('Move to cart error:', err.message);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };


export const moveToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params; // ✅ Get productId from URL params

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const user = await User.findById(userId);

    // ✅ Remove from wishlist
    user.wishlist.pull(productId);

    // ✅ Check if product already exists in cart
    const existingCartItem = user.cart.find(item =>
      item.productId?.toString() === productId.toString()
    );
    

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      user.cart.push({ productId: productId, quantity: 1 });
    }

    await user.save();

    // ✅ Populate wishlist and cart.productId
    const updatedUser = await User.findById(userId)
      .populate('wishlist')
      .populate('cart.productId');

    res.status(200).json({
      message: 'Moved to cart',
      wishlist: updatedUser.wishlist,
      cart: updatedUser.cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
