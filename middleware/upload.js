// upload.js
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // To load environment variables

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products', // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Valid formats
    transformation: [{ width: 800, height: 800, crop: 'limit' }], // Optional: resize large images
  },
});

// Multer Upload Middleware using Cloudinary
const upload = multer({ storage });

export default upload;
