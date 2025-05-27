import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  
},{
    timestamps: true, // ✅ adds createdAt and updatedAt automatically
  }
);

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

export default Subscriber;
