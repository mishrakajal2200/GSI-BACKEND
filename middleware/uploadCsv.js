// config/multer.js (example file)
import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadCsv = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // optional: 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!'), false);
    }
  },
});
