
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import path from 'path';
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
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadPath = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}
dotenv.config();
const app = express();




const allowedOrigins = [
  'https://gsienterprises.com',
  'https://www.gsienterprises.com',
  'https://preeminent-begonia-54c21c.netlify.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("🟡 CORS Origin:", origin);
    // Accept requests with no origin (e.g., curl, same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("🔴 Blocked by CORS:", origin);
      callback(null, false); // Don't throw error, just block CORS headers
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};


app.use(cors(corsOptions));

// ✅ Request logger middleware
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url} from ${req.headers.origin}`);
  next();
});

// ✅ Body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(uploadPath));

// ✅ Create Admin User
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
      password: "gautamgsienterses7788", // 🔐 Note: For production, hash manually before saving
      role: "admin",
    });

    await admin.save();
    console.log("✅ GSI Admin created successfully");
  } catch (error) {
    console.error("❌ Error creating admin", error);
  }
};

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
  createAdmin(); // Only run after DB is connected
}).catch(err => console.error('❌ MongoDB connection error', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
