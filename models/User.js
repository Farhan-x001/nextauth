// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
});

// Ensure that the model is only created once
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
