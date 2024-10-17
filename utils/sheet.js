
import { Parser } from 'json2csv';
import { Expense } from '../models/Expense.js';

 export const downloadBalanceSheet = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('participants.user');
    
    const fields = ['description', 'amount', 'splitType', 'participants.user.name', 'participants.owedAmount'];
    const parser = new Parser({ fields });
    const csv = parser.parse(expenses);

    res.header('Content-Type', 'text/csv');
    res.attachment('balance_sheet.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const getAmountFromPercentage = (amount, percent) => {
    
    const owedAmount = (amount * percent) / 100;     
    const remainingAmount = amount - owedAmount;   
    console.log("owedAmount",owedAmount)   
    return  owedAmount ;
}

