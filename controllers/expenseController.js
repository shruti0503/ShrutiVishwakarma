
import { Expense } from '../models/Expense.js';
import { User } from '../models/User.js';
import { getAmountFromPercentage } from '../utils/sheet.js';

export const addExpense = async (req, res) => {
  const { description, amount, splitType, participants } = req.body;
  console.log("description, amount, splitType, participants", description, amount, splitType, participants);

  if (splitType === 'percentage') {
    const totalPercentage = participants.reduce((acc, p) => acc + p.percentage, 0);
    if (totalPercentage !== 100) return res.status(400).send('Percentages must add up to 100%');
  }

  let calculatedParticipants;

  if (splitType === "exact") {
    calculatedParticipants = participants.map(participant => {
      return {
        user: participant.user,
        owedAmount: -participant.owedAmount
      };
    });
  } else if (splitType === "percentage" || splitType === "equal") {
    calculatedParticipants = participants.map(participant => {
      return {
        user: participant.user,
        owedAmount: splitType === 'equal' ? amount / participants.length : -(getAmountFromPercentage(amount, participant.percentage))
      };
    });
  }

  try {
    const expense = new Expense({
      description,
      amount,
      splitType,
      participants: calculatedParticipants
    });

    // Save the expense
    await expense.save();

    // Update each participant's balance
    for (const participant of calculatedParticipants) {
      const user = await User.findById(participant.user);
      if (!user) {
        return res.status(404).send(`User with ID ${participant.user} not found`);
      }
      user.balance = (user.balance || 0) + participant.owedAmount;
      await user.save();
    }

    res.status(201).send(expense);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


export const getUserExpenses = async (req, res) => {
    try {
      const expenses = await Expense.find({ 'participants.user': req.params.userId });
      res.send(expenses);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
  

export const getAllExpenses = async (req, res) => {
    try {
      const expenses = await Expense.find().populate('participants.user');
      res.send(expenses);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
  