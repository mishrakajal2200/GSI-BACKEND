
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import nodemailer from 'nodemailer';
// import bodyParser from 'body-parser';
// import path from 'path';
// import User from './models/User.js';
// import productRoutes from './routes/productRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import subscribeRoutes from './routes/subscribeRoutes.js';
// import cartRoutes from './routes/cartRoutes.js';
// import wishlistRoutes from './routes/wishlistRoutes.js';
// import shopRoutes from './routes/shopRoutes.js';
// import filtersRoutes from './routes/filtersRoutes.js';
// import payment from './routes/payment.js';
// import adminRoutes from './routes/adminRoutes.js';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import fs from 'fs';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath);
// }
// dotenv.config();
// const app = express();




// const allowedOrigins = [
//   'https://gsienterprises.com',
//   'https://www.gsienterprises.com',
//   'https://preeminent-begonia-54c21c.netlify.app',
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     console.log("🟡 CORS Origin:", origin);
//     // Accept requests with no origin (e.g., curl, same-origin)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.error("🔴 Blocked by CORS:", origin);
//       callback(null, false); // Don't throw error, just block CORS headers
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// };


// app.use(cors(corsOptions));

// // ✅ Request logger middleware
// app.use((req, res, next) => {
//   console.log(`➡️ ${req.method} ${req.url} from ${req.headers.origin}`);
//   next();
// });

// // ✅ Body parsers
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());



// // 🧠 Storage config (no timestamp added to filename)
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); // Don't change the name
//   },
// });

// const upload = multer({ storage });


// app.post('/api/upload', upload.single('image'), (req, res) => {
//   const imagePath = `/uploads/${req.file.originalname}`;
//   res.json({ image: imagePath });
// });


// // ✅ Nodemailer setup
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// // ✅ Contact Us Route
// app.post('/api/contact', (req, res) => {
//   const { name, email, subject, message } = req.body;

//   const mailOptions = {
//     from: email,
//     to: process.env.EMAIL_USER,
//     subject: `Contact Us: ${subject}`,
//     text: `You have a new message from ${name} (${email}):\n\n${message}`,
//   };

//   transporter.sendMail(mailOptions, (err, info) => {
//     if (err) {
//       console.error("Nodemailer error:", err);
//       return res.status(500).json({ message: 'Error sending message', error: err.toString() });
//     } else {
//       return res.status(200).json({ message: 'Message sent successfully', info });
//     }
//   });
// });

// // ✅ API Routes
// app.use('/api/auth', userRoutes);
// app.use('/api/subs', subscribeRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/wishlist', wishlistRoutes);
// app.use('/api/getproducts', productRoutes);
// app.use('/api/nearby', shopRoutes);
// app.use('/api/filters', filtersRoutes);
// app.use('/api/payment', payment);
// app.use('/api/admin', adminRoutes);

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static(uploadPath));

// // ✅ Create Admin User
// const createAdmin = async () => {
//   try {
//     const existing = await User.findOne({ email: "gsienterprises@gautam.com" });
//     if (existing) {
//       console.log("🟢 Admin already exists");
//       return;
//     }

//     const admin = new User({
//       name: "GSI Admin",
//       email: "gsienterprises@gautam.com",
//       password: "gautamgsienterses7788", // 🔐 Note: For production, hash manually before saving
//       role: "admin",
//     });

//     await admin.save();
//     console.log("✅ GSI Admin created successfully");
//   } catch (error) {
//     console.error("❌ Error creating admin", error);
//   }
// };

// // ✅ Connect to MongoDB and start server
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('✅ MongoDB connected');
//   createAdmin(); // Only run after DB is connected
// }).catch(err => console.error('❌ MongoDB connection error', err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });




import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import path from 'path';

import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 🧠 Models and Routes
import User from './models/User.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import subscribeRoutes from './routes/subscribeRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import filtersRoutes from './routes/filtersRoutes.js';
import payment from './routes/payment.js';
import adminRoutes from './routes/adminRoutes.js';

// ✅ Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




// ✅ Load environment variables
dotenv.config();

// ✅ App setup
const app = express();

// 👇 This line serves static files from public folder
app.use('/image', express.static(path.join(__dirname, 'public/image')));


// ✅ CORS Configuration
const allowedOrigins = [
  'https://gsienterprises.com',
  'https://www.gsienterprises.com',
  'https://preeminent-begonia-54c21c.netlify.app',
  "http://localhost:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("🟡 CORS Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("🔴 Blocked by CORS:", origin);
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Middleware
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url} from ${req.headers.origin}`);
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Multer setup for file uploads (unique filenames)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ Upload Route
app.post('/api/upload', upload.single('image'), (req, res) => {
  const imagePath = `/uploads/${req.file.filename}`;
  res.json({ image: imagePath });
});

// ✅ Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ✅ Contact Us Route
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Contact Us: ${subject}`,
    text: `You have a new message from ${name} (${email}):\n\n${message}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Nodemailer error:", err);
      return res.status(500).json({ message: 'Error sending message', error: err.toString() });
    } else {
      return res.status(200).json({ message: 'Message sent successfully', info });
    }
  });
});

// ✅ API Routes
app.use('/api/auth', userRoutes);
app.use('/api/subs', subscribeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/getproducts', productRoutes);
app.use('/api/nearby', shopRoutes);
app.use('/api/filters', filtersRoutes);
app.use('/api/payment', payment);
app.use('/api/admin', adminRoutes);

// ✅ Create Admin User (optional)
const createAdmin = async () => {
  try {
    const existing = await User.findOne({ email: "gsienterprises@gautam.com" });
    if (existing) {
      console.log("🟢 Admin already exists");
      return;
    }

    const admin = new User({
      name: "GSI Admin",
      email: "gsienterprises@gautam.com",
      password: "gautamgsienterses7788", // 🔐 Note: In production, always hash passwords
      role: "admin",
    });

    await admin.save();
    console.log("✅ GSI Admin created successfully");
  } catch (error) {
    console.error("❌ Error creating admin", error);
  }
};

// ✅ MongoDB Connection and Start Server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
  createAdmin();
}).catch(err => console.error('❌ MongoDB connection error', err));

// ✅ Serve React Frontend Build
app.use(express.static(path.join(__dirname, '../GSI-FRONTEND/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../GSI-FRONTEND/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
