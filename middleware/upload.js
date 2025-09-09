// // middleware/upload.js
// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // make sure this folder exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed'), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// export default upload;


// // middleware/upload.js
// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // make sure this folder exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed'), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// // Export a fields handler to support both 'image' and 'images'  
// export const multiUpload = upload.fields([
//   { name: 'image', maxCount: 1 },
//   { name: 'images', maxCount: 5 }, // up to 4 additional images
// ]);



import multer from "multer";
import path from "path";

// --- For images ---
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const uploadImages = multer({ storage: imageStorage, fileFilter: imageFilter });

// --- For Excel (.xlsx) ---
const excelStorage = multer.memoryStorage(); // keep file in memory for ExcelJS
const excelFilter = (req, file, cb) => {
  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .xlsx files are allowed"), false);
  }
};

const uploadCsv = multer({ storage: excelStorage, fileFilter: excelFilter });

// --- Exports ---
export const multiUpload = uploadImages.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

export { uploadCsv };
