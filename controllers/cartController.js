import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
// 📦 Get Cart Items

import mongoose from 'mongoose';
export const cleanCart = async (req, res) => {
  try {
    const users = await User.find({});
    for (const user of users) {
      const validCart = user.cart.filter(item => mongoose.Types.ObjectId.isValid(item.productId));
      user.cart = validCart;
      await user.save();
    }
    res.json({ message: 'Cleaned all user carts with invalid productIds' });
  } catch (error) {
    console.error("Cart cleaning failed:", error);
    res.status(500).json({ message: 'Failed to clean carts' });
  }
};

// export const getCart = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate({
//       path: 'cart.productId',
//       select: 'name price image', // ✅ only these fields will be fetched
//     });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const cartItems = (user.cart || []).reduce((acc, item) => {
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
//           quantity: item.quantity,
//         });
//       }
//       return acc;
//     }, []);

//     res.status(200).json({ cart: cartItems });

//   } catch (err) {
//     console.error("❌ Error fetching cart:", err.message);
//     res.status(500).json({ message: 'Internal server error while fetching cart' });
//   }
// };
// export const getCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.user._id });
//     res.json(cart || { items: [] });
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching cart" });
//   }
// };


// export const addToCart = async (req, res) => {
//   const { productId } = req.body;
//   const userId = req.user.id;

//   // Fetch the product
//   const product = await Product.findById(productId);
//   if (!product) return res.status(404).json({ message: "Product not found" });

//   // Find the user
//   const user = await User.findById(userId);
//   if (!Array.isArray(user.cart)) {
//      user.cart = [];
//   }

//   // Check if the item already exists in the cart
//     const existingItem = user.cart.find(
//    (item) => item.productId?.toString() === productId
//   );

//   if (existingItem) {
//     // If it already exists, increase quantity
//     existingItem.quantity += 1;
//   } else {
//     // If not, add it to the cart
//     user.cart.push({
//       productId,
//       name: product.name,
//       image: product.image,
//       price: product.price,
//       quantity: 1,
//     });
//   }

//   // Save the updated user data
//   await user.save();

//   // Respond with the updated cart
//   return res.status(200).json({ cart: user.cart });
// };


// export const addToCart = async (req, res) => {
//   const { productId, quantity = 1, selectedColor, size, cartImage } = req.body;

//   try {
//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     let cart = await Cart.findOne({ userId: req.user._id });

//     if (!cart) {
//       cart = new Cart({ userId: req.user._id, items: [] });
//     }

//     const existingItem = cart.items.find(
//       item => item.productId.toString() === productId && item.selectedColor === selectedColor && item.size === size
//     );

//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       cart.items.push({
//         productId,
//         name: product.name,
//         price: product.price,
//         mrp: product.mrp,
//         brand: product.brand,
//         cartImage: product.images.front || product.images.side || product.images.back || "",
//         images: product.images,
//         selectedColor,
//         size,
//         cartImage,
//         quantity,
//       });
//     }

//     await cart.save();
//     res.json(cart);
//   } catch (err) {
//     res.status(500).json({ message: "Error adding to cart" });
//   }
// };

 
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId"); // ✅ Populate full product data
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
  }
};


// export const addToCart = async (req, res) => {
//   const { productId, quantity = 1, selectedColor, size, cartImage } = req.body;

//   try {
//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     let cart = await Cart.findOne({ userId: req.user._id });

//     if (!cart) {
//       cart = new Cart({ userId: req.user._id, items: [] });
//     }

//     const existingItem = cart.items.find(
//       item => item.productId.toString() === productId && item.selectedColor === selectedColor && item.size === size
//     );

//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       cart.items.push({
//         productId,
//         name: product.name,
//         price: product.price,
//         mrp: product.mrp,
//         brand: product.brand,
//         cartImage: product.images.front || product.images.side || product.images.back || "",
//         images: product.images,
//         selectedColor,
//         size,
//         cartImage,
//         quantity,
//       });
//     }

//     await cart.save();
//     res.json(cart);
//   } catch (err) {
//     res.status(500).json({ message: "Error adding to cart" });
//   }
// };
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    console.log("User:", userId);
    console.log("Product ID:", productId);
    console.log("Quantity:", quantity);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cartItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (cartItemIndex !== -1) {
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      user.cart.push({
        productId,
        name: product.name,
        image: product.images?.[0],
        price: product.price,
        quantity,
      });
    }

    await user.save();
    res.status(200).json({ message: "Product added to cart", cart: user.cart });

  } catch (err) {
    console.error("Error in addToCart:", err.message);
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
};


export const updateQuantity = async (req, res) => {
  const { productId, action, selectedColor, size } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      item => item.productId.toString() === productId && item.selectedColor === selectedColor && item.size === size
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = action === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error updating quantity" });
  }
};


// 🔼 Increase Quantity
export const increaseQuantity = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (!Array.isArray(user.cart)) user.cart = [];

  const item = user.cart.find(
    (item) => item.productId?.toString() === productId
  );

  if (item) {
    item.quantity += 1;
    await user.save();

    // ✅ Re-fetch user with populated product details
    const updatedUser = await User.findById(req.user._id).populate({
      path: 'cart.productId',
      select: 'name price image',
    });

    const cartItems = updatedUser.cart.map(item => {
      if (
        item.productId &&
        item.productId._id &&
        mongoose.Types.ObjectId.isValid(item.productId._id)
      ) {
        return {
          productId: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.image,
          quantity: item.quantity,
        };
      }
      return null;
    }).filter(Boolean);

    res.status(200).json({ cart: cartItems });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
};


// 🔽 Decrease Quantity
export const decreaseQuantity = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);
  
  if (!user) return res.status(404).json({ message: "User not found" });
  if (!Array.isArray(user.cart)) user.cart = [];

  const item = user.cart.find(
    (item) => item.productId?.toString() === productId
  );

  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1; // Decrease quantity by 1
    } else {
      return res.status(400).json({ message: "Quantity cannot be less than 1" });
    }
    await user.save();

    // ✅ Re-fetch user with populated product details
    const updatedUser = await User.findById(req.user._id).populate({
      path: 'cart.productId',
      select: 'name price image',
    });

    const cartItems = updatedUser.cart.map(item => {
      if (
        item.productId &&
        item.productId._id &&
        mongoose.Types.ObjectId.isValid(item.productId._id)
      ) {
        return {
          productId: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.image,
          quantity: item.quantity,
        };
      }
      return null;
    }).filter(Boolean);

    res.status(200).json({ cart: cartItems });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
};


// ❌ Remove Item from Cart
// export const removeFromCart = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     if (!productId) {
//       return res.status(400).json({ message: "Product ID is required" });
//     }

//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Find the item to be removed
//     const itemIndex = user.cart.findIndex((item) => item.productId?.toString() === productId);

//     if (itemIndex === -1) {
//       return res.status(404).json({ message: "Item not found in cart" });
//     }

//     // Remove the item from the cart
//     user.cart.splice(itemIndex, 1);

//     await user.save();

//     // Re-fetch the user with populated product details, if needed
//     const updatedUser = await User.findById(req.user._id).populate({
//       path: 'cart.productId',
//       select: 'name price image',
//     });

//     const cartItems = updatedUser.cart.map(item => {
//       if (item.productId && item.productId._id) {
//         return {
//           productId: item.productId._id,
//           name: item.productId.name,
//           price: item.productId.price,
//           image: item.productId.image,
//           quantity: item.quantity,
//         };
//       }
//       return null;
//     }).filter(Boolean);

//     res.status(200).json({ cart: cartItems });
//   } catch (err) {
//     console.error("Error removing item from cart:", err.message);
//     res.status(500).json({ message: "Error removing item from cart" });
//   }
// };

export const removeFromCart = async (req, res) => {
  const { productId, selectedColor, size } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      item => !(item.productId.toString() === productId && item.selectedColor === selectedColor && item.size === size)
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error removing from cart" });
  }
};


// 🧹 Clear Entire Cart
export const clearCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.status(200).json({ message: 'Cart cleared', cart: [] });
};

// 💾 Save for Later
// Controller for Save for Later
export const saveForLater = async (req, res) => {
  try {
    const { productId } = req.params; // Get the productId from URL
    const user = await User.findById(req.user._id); // Find the user

    if (!user) return res.status(404).json({ message: "User not found" });

    // Find the item in the cart
  const item = user.cart.find(
  (item) => item.productId.toString() === productId.toString()
);


    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove the item from the cart
    user.cart = user.cart.filter((item) => item.productId.toString() !== productId);

    // Save the item to the wishlist
    if (!user.wishlist.some((item) => item.productId.toString() === productId)) {
      user.wishlist.push(item);
    }

    // Save the updated user
    await user.save();

    // Optionally, populate product details
    const updatedUser = await User.findById(req.user._id).populate({
      path: 'cart.productId',
      select: 'name price image',
    });

    // Map through and return updated cart items
    const cartItems = updatedUser.cart.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      quantity: item.quantity,
    }));

    // Return updated data
    res.status(200).json({
      message: "Item saved for later",
      cart: cartItems,
      savedItems: user.wishlist,
    });
  } catch (err) {
    console.error("Error saving item for later:", err.message);
    res.status(500).json({ message: "Error saving item for later" });
  }
};


// 🔁 Move Item Back to Cart
export const moveToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyInCart = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (!alreadyInCart) {
      user.cart.push({ productId, quantity: 1 });
    } else {
      alreadyInCart.quantity += 1;
    }

    user.wishlist = user.wishlist.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();

    // Populate product details in updated cart
    const updatedUser = await User.findById(req.user._id).populate({
      path: 'cart.productId',
      select: 'name price image',
    });

    const cartItems = updatedUser.cart.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      quantity: item.quantity,
    }));

    res.status(200).json({
      message: "Item moved back to cart",
      cart: cartItems,
      savedItems: user.wishlist,
    });
  } catch (err) {
    console.error("Error moving item to cart:", err.message);
    res.status(500).json({ message: "Error moving item to cart" });
  }
};


// Controller
export const applyCoupon = async (req, res) => {
  const { code } = req.body;

  const user = await User.findById(req.user._id).populate('cart.productId');

  if (!user) return res.status(404).json({ message: "User not found" });

  const validCoupons = {
    SAVE10: 10,
    DISCOUNT20: 20,
    WELCOME50: 50,
  };

  if (!validCoupons[code]) {
    return res.status(400).json({ message: "Invalid coupon code" });
  }

  const discount = validCoupons[code];

  // Apply discount to total
  let total = 0;
  user.cart.forEach(item => {
    total += item.productId.price * item.quantity;
  });

  const discountedTotal = total - (total * discount) / 100;

  res.json({
    message: "Coupon applied",
    originalTotal: total,
    discount,
    finalTotal: discountedTotal.toFixed(2),
  });
};
