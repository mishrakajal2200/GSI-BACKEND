// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/image/');
  },
  filename: function (req, file, cb) {
    // Unique filename
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Filter file types (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  cb(new Error('Only images are allowed!'));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
