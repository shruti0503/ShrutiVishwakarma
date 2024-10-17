
import { Expense } from '../models/Expense.js';
import { User } from '../models/User.js';
import { getAmountFromPercentage } from '../utils/sheet.js';

export const addExpense = async (req, res) => {
  const { description, amount, splitType, participants } = req.body;
  console.log("description, amount, splitType, participants",description, amount, splitType, participants)

  if (splitType === 'percentage') {
    console.log("split type is", splitType)
    const totalPercentage = participants.reduce((acc, p) => acc + p.percentage, 0);
    if (totalPercentage !== 100) return res.status(400).send('Percentages must add up to 100%');
  }
  let calculatedParticipants;

  if(splitType==="exact"){
    //epxense -> 5000 , i owe : 300 , A -> 1000 , bB> 800 
     calculatedParticipants = participants.map(participant => {
        return {
          email: participant.email,
          owedAmount: participant.owedAmount
        };
      });
  }
  else if(splitType==="percentage" || splitType==="equal"){
     calculatedParticipants = participants.map(participant => {
        return {
          email: participant.email,
          owedAmount:  
    
          splitType === 'equal' 
            ? amount / participants.length 
            : getAmountFromPercentage(amount, participant.percentage) 
        };
      });

  }

 
  
  console.log("calculatedParticipants",calculatedParticipants)

  try {
    const expense = new Expense({
      description,
      amount,
      splitType,
      participants: calculatedParticipants
    });

    await expense.save();
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
  