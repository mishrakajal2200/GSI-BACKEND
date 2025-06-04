

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
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

dotenv.config();

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  'https://gsienterprises.com',
  'https://www.gsienterprises.com',
  'https://preeminent-begonia-54c21c.netlify.app',
  'http://localhost:3000',
];

// ✅ CORS options
const corsOptions = {
  origin: function (origin, callback) {
    console.log("🟡 CORS Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("🔴 Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// ✅ CORS middleware must be before routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ Handle preflight OPTIONS requests automatically

// ✅ Request logger
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url} from ${req.headers.origin}`);
  next();
});

// ✅ Body parsers and JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Serve static images
app.use('/images', express.static('src/images'));

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

// ✅ Create Admin User
const createAdmin = async () => {
  try {
    const existing = await User.findOne({ email: "admin@example.com" });
    if (existing) {
      console.log("🟢 Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin created successfully");
  } catch (error) {
    console.error("❌ Error creating admin", error);
  }
};

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
  createAdmin(); // 🔄 Run only after DB is connected
}).catch(err => console.error('❌ MongoDB connection error', err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
