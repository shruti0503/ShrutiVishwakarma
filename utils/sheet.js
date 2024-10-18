import { User } from '../models/User.js';
import { Parser } from 'json2csv';
import fs from 'fs';

export const downloadBalanceSheet = async (req, res) => {
  try {
    // Step 1: Retrieve all users
    const users = await User.find().populate('owned.user').populate('owes.user');

    // Step 2: Create a balance summary
    const balanceSummary = users.map(user => {
      let totalOwes = user.owes.reduce((acc, owe) => acc + owe.pay, 0);
      let totalOwned = user.owned.reduce((acc, own) => acc + own.pay, 0);

      return {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        balance: user.balance,
        totalOwes,
        totalOwned,
        netBalance: totalOwned - totalOwes  // How much they are owed minus how much they owe
      };
    });

    // Step 3: Convert the summary to CSV format or other format (e.g., JSON)
    const fields = ['name', 'email', 'mobile', 'balance', 'totalOwes', 'totalOwned', 'netBalance'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(balanceSummary);

    // Step 4: Generate a downloadable file (CSV)
    const filePath = './balance-sheet.csv';
    fs.writeFileSync(filePath, csv);

    // Step 5: Send the file to the client
    res.download(filePath, 'balance-sheet.csv', (err) => {
      if (err) {
        return res.status(500).send('Error downloading the file');
      }

      // Optionally, delete the file after download
      fs.unlinkSync(filePath);
    });
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

