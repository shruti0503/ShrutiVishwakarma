// server.js
import express from "express"
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv"

import authRoutes from "./routes/authRoutes.js"
import expenseRoutes from "./routes/ExpenseRoutes.js"
// const userRoutes = require('./routes/userRoutes');

dotenv.config();


const app = express();
app.use(bodyParser.json());

// app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/auth',authRoutes)

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
