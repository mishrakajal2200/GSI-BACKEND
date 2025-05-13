// // import jwt from 'jsonwebtoken';
// // import User from '../models/User.js';

// // const protect = async (req, res, next) => {
// //   let token;

// //   // Check if token exists in headers
// //   if (
// //     req.headers.authorization &&
// //     req.headers.authorization.startsWith('Bearer')
// //   ) {
// //     try {
// //       // Get token from header
// //       token = req.headers.authorization.split(' ')[1];

// //       // Verify token
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //       // Get user from the token (excluding password)
// //       req.user = await User.findById(decoded.id).select('-password');

// //       next(); // Proceed to protected route
// //     } catch (error) {
// //       res.status(401).json({ message: 'Not authorized, token failed' });
// //     }
// //   }

// //   if (!token) {
// //     res.status(401).json({ message: 'Not authorized, no token' });
// //   }
// // };

// // export default protect;

// // Backend (Node.js/Express.js) - middleware/auth.js (ESM)
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     try {
//       token = req.headers.authorization.split(' ')[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select('-password');

//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };

// export default protect;


// middleware/authMiddleware.js
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js'; // Adjust path as needed

// export const authenticateUser = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       // Get token from header
//       token = req.headers.authorization.split(' ')[1];

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Get user from token (excluding password)
//       req.user = await User.findById(decoded.userId).select('-password');

//       if (!req.user) {
//         return res.status(401).json({ message: 'Not authorized, user not found' });
//       }

//       next();
//     } catch (error) {
//       console.error('Error in authenticateUser:', error);
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };

// export const authorizeAdmin = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     res.status(403).json({ message: 'Not authorized as an admin' });
//   }
// };

// export default authenticateUser;


// backend/middleware/authMiddleware.js
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// export const authenticateUser = async (req, res, next) => {
//   let token;
//   if (req.headers.authorization?.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       console.log('Token received:', token); // Log the token

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log('Decoded token:', decoded); // Log the decoded payload

//       req.user = await User.findById(decoded.userId).select('-password');
//       console.log('User found:', req.user); // Log the user object

//       next();
//     } catch (error) {
//       console.error('Authentication error:', error); // Log the error
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   } else {
//     console.log('No token received'); // Log if no token
//     res.status(401).json({ message: 'No token, authorization denied' });
//   }
// };

// // backend/controllers/cartController.js (Example)
// export const addItemToCart = async (req, res) => {
//   try {
//     console.log('User authenticated:', req.user); // Log the authenticated user
//     // ... your logic to add item to cart ...
//     res.status(200).json({ message: 'Item added to cart successfully' });
//   } catch (error) {
//     console.error('Error adding to cart:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export default authenticateUser;


// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// export const authenticateUser = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader?.startsWith('Bearer')) {
//     try {
//       const token = authHeader.split(' ')[1];
//       console.log('Token received:', token);

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log('Decoded token:', decoded);

//       if (!decoded.userId) {
//         return res.status(401).json({ message: 'Invalid token structure' });
//       }

//       req.user = await User.findById(decoded.userId).select('-password');
//       console.log('User found:', req.user);

//       if (!req.user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       next();
//     } catch (error) {
//       console.error('Authentication error:', error.name, error.message);
//       if (error.name === 'TokenExpiredError') {
//         return res.status(401).json({ message: 'Token expired. Please log in again.' });
//       }
//       res.status(401).json({ message: 'Not authorized, token invalid.' });
//     }
//   } else {
//     console.log('No token received');
//     res.status(401).json({ message: 'No token, authorization denied' });
//   }
// };

// export default authenticateUser;



import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      console.log('Token received:', token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      // Support both userId or id in payload
      const userId = decoded.userId || decoded.id;

      if (!userId) {
        return res.status(401).json({ message: 'Invalid token structure' });
      }

      req.user = await User.findById(userId).select('-password');
      console.log('User found:', req.user);

      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error.name, error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please log in again.' });
      }
      res.status(401).json({ message: 'Not authorized, token invalid.' });
    }
  } else {
    console.log('No token received');
    res.status(401).json({ message: 'No token, authorization denied' });
  }
};


export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Access denied, admin only' });
};

export default authenticateUser;
