// import express from 'express';
// import jwt from 'jsonwebtoken';
// import twilio from 'twilio';
// import Admin from '../models/Admin.js';

// const router = express.Router();
// const otpStore = new Map(); // Use Redis in production
// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// // Setup Twilio client
// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// // Send OTP
// // routes/adminRoutes.js
// router.post('/send-otp', async (req, res) => {
//   const { phone } = req.body;

//   try {
//     let admin = await Admin.findOne({ phone });
//     if (!admin) {
//       admin = new Admin({ phone });
//       await admin.save();
//     }

//     const otp = generateOTP();
//     otpStore.set(phone, otp);

//     // Send OTP via Twilio
//     try {
//       const message = await twilioClient.messages.create({
//         body: `Your OTP is: ${otp}`,
//         from: process.env.TWILIO_PHONE_NUMBER,
//         to: phone,
//       });
//       console.log(`OTP sent to ${phone}: ${message.sid}`);

//       res.json({ message: 'OTP sent successfully' });
//     } catch (twilioError) {
//       console.error('Error sending OTP via Twilio:', twilioError);
//       res.status(500).json({ message: 'Failed to send OTP via Twilio', error: twilioError.message });
//     }
//   } catch (error) {
//     console.error('Error processing send-otp request:', error);
//     res.status(500).json({ message: 'Error processing request', error: error.message });
//   }
// });


// // Verify OTP
// router.post('/verify-otp', async (req, res) => {
//   const { phone, otp } = req.body;

//   const realOtp = otpStore.get(phone);
//   if (!realOtp || realOtp !== otp) {
//     return res.status(401).json({ message: 'Invalid or expired OTP' });
//   }

//   const admin = await Admin.findOne({ phone });
//   if (!admin) return res.status(404).json({ message: 'Admin not found' });

//   otpStore.delete(phone);
//   admin.isVerified = true;
//   await admin.save();

//   const token = jwt.sign(
//     { id: admin._id, phone: admin.phone },
//     process.env.JWT_SECRET,
//     { expiresIn: '1d' }
//   );

//   res.json({ token, message: 'Login successful' });
// });

// export default router;


import express from 'express';
import User from '../models/User.js'; // User model
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Nexmo from 'nexmo'; // Nexmo for sending SMS

dotenv.config();

const router = express.Router();

// Nexmo setup for sending SMS
const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET,
});

// Step 1: Send an SMS (instead of OTP generation for now)
router.post('/admin/send-sms', async (req, res) => {
  try {
    // Predefined message for SMS
    const smsMessage = 'This is a test SMS from the Admin system. Please verify your login.';

    // Predefined recipient phone number (or can be dynamic based on your application)
    const toPhone = process.env.ADMIN_PHONE_NUMBER;  // Admin's phone number for testing
    const fromPhone = process.env.NEXMO_PHONE_NUMBER;  // Your Nexmo phone number

    // Send the SMS using Nexmo API
    nexmo.message.sendSms(fromPhone, toPhone, smsMessage, (err, responseData) => {
      if (err) {
        console.error('Error sending SMS:', err);
        return res.status(500).json({ message: 'Failed to send SMS' });
      } else {
        if (responseData.messages[0].status === '0') {
          res.json({ message: 'SMS sent successfully' });
        } else {
          res.status(500).json({ message: 'Failed to send SMS' });
        }
      }
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ message: 'Failed to send SMS' });
  }
});

// Step 2: (No change here - assume the user verifies via another method)
router.post('/admin/verify-sms', async (req, res) => {
  try {
    // This would be the verification process for the SMS
    // Typically would handle this after sending an OTP or verification code

    res.json({ message: 'SMS verified successfully' });
  } catch (error) {
    console.error('Error verifying SMS:', error);
    res.status(500).json({ message: 'Failed to verify SMS' });
  }
});

export default router;
