
import multer from 'multer';
import path from 'path'; // ✅ Missing import added
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ✅ Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/image/')); // Adjust path as per your folder structure
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// ✅ Filter image file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, gif) are allowed!'));
  }
};

// ✅ Multer middleware
const upload = multer({ storage, fileFilter });

export default upload;
