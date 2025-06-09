const express = require("express");
const router = express.Router();
const { validateExpense } = require("../middleware/validation");
const expenseController = require("../controllers/expense");

router.get("/expenses", expenseController.getAllExpenses);
router.post("/expenses", validateExpense, expenseController.createExpense);
router.put("/expenses/:id", validateExpense, expenseController.updateExpense);
router.delete("/expenses/:id", expenseController.deleteExpense);

router.get("/people", expenseController.getAllPeople);
router.get("/balances", expenseController.getBalances);
router.get("/settlements", expenseController.getSettlements);

module.exports = router;
