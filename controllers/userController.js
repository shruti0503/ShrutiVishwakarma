
import User from '../models/User.js';
import Joi from 'joi';
import { Expense } from '../models/Expense.js';

exports.createUser = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().required(),
  });
  
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send('User not found');
      res.send(user);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  export const getUserExpenses = async (req, res) => {
    try {
      const userId = req.params.userId;
      const expenses = await Expense.find({ 'participants.user': userId });
      
      const totalOwed = expenses.reduce((total, expense) => {
        const participant = expense.participants.find(p => p.user == userId);
        return total + (participant ? participant.owedAmount : 0);
      }, 0);
  
      res.send({ expenses, totalOwed });
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  export const getAllExpenses = async (req, res) => {
    try {
      const expenses = await Expense.find().populate('participants.user');
      
      // Calculate overall expenses for each user
      const userBalances = {};
      expenses.forEach(expense => {
        expense.participants.forEach(participant => {
          const userId = participant.user._id;
          if (!userBalances[userId]) {
            userBalances[userId] = { user: participant.user, totalOwed: 0 };
          }
          userBalances[userId].totalOwed += participant.owedAmount;
        });
      });
  
      res.send(userBalances);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
  
  
  