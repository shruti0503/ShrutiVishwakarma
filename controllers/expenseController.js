
import { Expense } from '../models/Expense.js';
import { User } from '../models/User.js';
import { getAmountFromPercentage } from '../utils/sheet.js';


export const addExpense = async (req, res) => {
  const { description, amount, splitType, participants, payer } = req.body;
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
        owedAmount: participant.owedAmount
      };
    });
  } else if (splitType === "percentage" || splitType === "equal") {
    calculatedParticipants = participants.map(participant => {
      return {
        user: participant.user,
        owedAmount: splitType === 'equal' ? amount / participants.length : getAmountFromPercentage(amount, participant.percentage)
      };
    });
  }

  try {
    // Save the new expense
    const expense = new Expense({
      description,
      amount,
      splitType,
      participants: calculatedParticipants,
      payer // Include the payer of the expense
    });
    await expense.save();

    // Update balances and owed/own lists for participants and payer
    for (const participant of calculatedParticipants) {
      const user = await User.findById(participant.user);
      const payerUser = await User.findById(payer);
      
      if (!user || !payerUser) {
        return res.status(404).send(`User with ID ${participant.user} or Payer ${payer} not found`);
      }

      if (user._id.toString() !== payer) {
        // Update the 'owes' field for participants (this user owes money to the payer)
        user.owes.push({ user: payer, pay: participant.owedAmount });
        payerUser.owned.push({ user: user._id, pay: participant.owedAmount });
        
        // Update balances
        user.balance = (user.balance || 0) - participant.owedAmount;  // Deduct the amount the user owes
        payerUser.balance = (payerUser.balance || 0) + participant.owedAmount;  // Increase the payer's balance
      }
      
      await user.save();
      await payerUser.save();
    }

    res.status(201).send(expense);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


export const getUserExpenses = async (req, res) => {
    try {
      const user = await User.findById( req.params.userId );
      const balance=user.balance
      res.status(200).send({balance});
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
  

  export const getAllExpenses = async (req, res) => {
    try {
      
      const userExpenses = await User.find({ balance: { $exists: true } }).select('-password');
      
      res.send(userExpenses);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
  
  