const Expense = require("../models/expense");
const {
  catchAsync,
  calculateBalances,
  calculateSettlements,
} = require("../utils/helpers");
const { validationResult } = require("express-validator");
const { AppError } = require("../middleware/error");

// Get all expenses
exports.getAllExpenses = catchAsync(async (req, res, next) => {
  const expenses = await Expense.find().sort("-createdAt");
  res.json({
    success: true,
    data: expenses,
    message: "Expenses retrieved successfully",
  });
});

// Create new expense
exports.createExpense = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const expense = await Expense.create(req.body);
  res.status(201).json({
    success: true,
    data: expense,
    message: "Expense created successfully",
  });
});

// Update expense
exports.updateExpense = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const expenseId = req.params.id || req.query.id;
  if (!expenseId) {
    return next(new AppError("Expense ID is required", 400));
  }

  const expense = await Expense.findByIdAndUpdate(expenseId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!expense) {
    return next(new AppError("Expense not found", 404));
  }

  res.json({
    success: true,
    data: expense,
    message: "Expense updated successfully",
  });
});

// Delete expense
exports.deleteExpense = catchAsync(async (req, res, next) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);

  if (!expense) {
    return next(new AppError("Expense not found", 404));
  }

  res.json({
    success: true,
    message: "Expense deleted successfully",
  });
});

// Get all people involved
exports.getAllPeople = catchAsync(async (req, res, next) => {
  const expenses = await Expense.find();
  const peopleSet = new Set();

  expenses.forEach((expense) => {
    peopleSet.add(expense.paid_by);
    expense.splits.forEach((split) => peopleSet.add(split.person));
  });

  const people = Array.from(peopleSet).sort();

  res.json({
    success: true,
    data: people,
    message: "People retrieved successfully",
  });
});

// Get balances
exports.getBalances = catchAsync(async (req, res, next) => {
  const expenses = await Expense.find();
  const balances = calculateBalances(expenses);

  res.json({
    success: true,
    data: balances,
    message: "Balances calculated successfully",
  });
});

// Get settlements
exports.getSettlements = catchAsync(async (req, res, next) => {
  const expenses = await Expense.find();
  const balances = calculateBalances(expenses);
  const settlements = calculateSettlements(balances);

  res.json({
    success: true,
    data: settlements,
    message: "Settlements calculated successfully",
  });
});
