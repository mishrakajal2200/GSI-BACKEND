
import multer from "multer";
import path from "path";

// ✅ Save uploads in "public/image" folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/image"); // ⬅️ Updated path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Add timestamp to avoid name conflicts
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);
  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb("Only image files are allowed!");
  }
};

export const upload = multer({
  storage,
  fileFilter,
});
