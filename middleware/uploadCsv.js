// middleware/uploadCsv.js
import multer from 'multer';

const storage = multer.memoryStorage(); // we’ll parse in memory
const uploadCsv = multer({ storage });

export default uploadCsv;
