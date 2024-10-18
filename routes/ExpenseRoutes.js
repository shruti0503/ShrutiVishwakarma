// /routes/expenseRoutes.js
import express from "express"
import { addExpense, getAllExpenses, getUserExpenses } from "../controllers/expenseController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { downloadBalanceSheet } from "../utils/sheet.js";
import { Router } from "express";
const router=Router();

//Add expense
router.post('/add-expense', authMiddleware, addExpense);

//Retrieve individual user expenses.
router.get('/user/:userId', authMiddleware, getUserExpenses);

//Retrieve overall expenses.
router.get('/overall-expenses', authMiddleware, getAllExpenses);

//Download Balance sheet
router.get('/balance-sheet', authMiddleware, downloadBalanceSheet);

export default router


