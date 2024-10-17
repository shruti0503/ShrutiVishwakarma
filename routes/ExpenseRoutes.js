// /routes/expenseRoutes.js
import express from "express"
import { addExpense, getAllExpenses, getUserExpenses } from "../controllers/expenseController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { downloadBalanceSheet } from "../utils/sheet.js";
import { Router } from "express";
const router=Router();

router.post('/add-expense', authMiddleware, addExpense);
router.get('/expense/user/:userId', authMiddleware, getUserExpenses);
router.get('/expenses', authMiddleware, getAllExpenses);
router.get('/balance-sheet', authMiddleware, downloadBalanceSheet);

export default router
