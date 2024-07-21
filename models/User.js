import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  password: String,
  otp: String,
  isVerified: Boolean,
  resetToken: String, // Add this field for password reset
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
