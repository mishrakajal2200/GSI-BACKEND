
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
// import bcrypt from 'bcryptjs'; // Add bcrypt import
// import User from './models/User.js'; // Add User model import
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

// Enable CORS for frontend (http://localhost:3000)
const allowedOrigins = [
  'https://gsienterprises.com', 'https://www.gsienterprises.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // <- Add this if you're using cookies/auth
};

// Use CORS middleware with the defined options
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // <--- This is the key fix
  },
});

// Contact Us Route
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
      console.error("Nodemailer error:", err); // <-- Log full error to console
      return res.status(500).json({ message: 'Error sending message', error: err.toString() });
    } else {
      return res.status(200).json({ message: 'Message sent successfully', info });
    }
  });
});

app.use('/images', express.static('src/images'));

app.use('/api/auth', userRoutes);
app.use('/api/auth/profilepage', userRoutes);
app.use('/api/subs', subscribeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/getproducts', productRoutes);
app.use('/api/nearby',shopRoutes);
app.use("/api/filters", filtersRoutes); 
app.use("/api/payment",payment);
app.use('/admin', adminRoutes);

// Connect DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true, // Set to `true` instead of `false`
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => console.log(err));

// Function to create admin user
// const createAdmin = async () => {
//   try {
//     const adminExists = await User.findOne({ email: 'gsienterprisesgautam@gmail.com' });
//     if (adminExists) {
//       console.log('✅ Admin already exists');
//       return;
//     }

//     const hashedPassword = await bcrypt.hash('admin123', 10);

//     const admin = new User({
//       name: 'Super Admin',
//       email: 'gsienterprisesgautam@gmail.com',
//       password: hashedPassword,
//       role: 'admin',
//     });

//     await admin.save();
//     console.log('✅ Admin user created successfully');
//   } catch (error) {
//     console.error('❌ Error creating admin:', error);
//   }
// };


// Call createAdmin once when the server starts (only in development or testing, not in production)
if (process.env.NODE_ENV === 'development') {
  createAdmin();
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
