// config/multer.js (example file)
// import multer from 'multer';

// const storage = multer.memoryStorage();

// export const uploadCsv = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // optional: 5MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === 'text/csv') {
//       cb(null, true);
//     } else {
//       cb(new Error('Only CSV files are allowed!'), false);
//     }
//   },
// });


import multer from "multer";

const storage = multer.memoryStorage();

export const uploadExcel = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // optional: 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // legacy .xls
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files (.xlsx, .xls) are allowed!"), false);
    }
  },
});
