import mongoose from 'mongoose';
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },  // Default to 0 if not specified
  owned: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to users who owe this user
      pay: { type: Number, required: true }  // Amount owed by others
    }
  ],
  owes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to users this user owes money to
      pay: { type: Number, required: true }  // Amount this user owes to others
    }
  ]
});



userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = mongoose.model('User', userSchema);
