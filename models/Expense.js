
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  splitType: { type: String, enum: ['equal', 'exact', 'percentage'], required: true },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User model
      owedAmount: { type: Number }
    }
  ],
  date: { type: Date, default: Date.now },
});

export const Expense = mongoose.model('Expense', expenseSchema);
