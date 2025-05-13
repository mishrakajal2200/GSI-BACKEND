// models/Admin.js
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
