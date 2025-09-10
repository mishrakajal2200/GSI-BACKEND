// // config/multer.js (example file)
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


// export const uploadCsv = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype === 'text/csv' ||
//       file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only CSV or Excel (.xlsx) files are allowed!'), false);
//     }
//   },
// });



import multer from "multer";

const storage = multer.memoryStorage();

export const uploadCsv = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/octet-stream", // some browsers use this
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV or Excel (.xlsx) files are allowed!"), false);
    }
  },
});
