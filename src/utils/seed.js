const mongoose = require("mongoose");
const path = require("path");
const Expense = require("../models/expense");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const testData = [
  {
    amount: 600,
    description: "Dinner",
    paid_by: "Shantanu",
    split_type: "equal",
    splits: [{ person: "Shantanu" }, { person: "Sanket" }, { person: "Om" }],
  },
  {
    amount: 450,
    description: "Groceries",
    paid_by: "Sanket",
    split_type: "equal",
    splits: [{ person: "Shantanu" }, { person: "Sanket" }, { person: "Om" }],
  },
  {
    amount: 300,
    description: "Petrol",
    paid_by: "Om",
    split_type: "equal",
    splits: [{ person: "Shantanu" }, { person: "Sanket" }, { person: "Om" }],
  },
  {
    amount: 500,
    description: "Movie",
    paid_by: "Shantanu",
    split_type: "equal",
    splits: [{ person: "Shantanu" }, { person: "Sanket" }, { person: "Om" }],
  },
  {
    amount: 280,
    description: "Pizza",
    paid_by: "Sanket",
    split_type: "equal",
    splits: [{ person: "Shantanu" }, { person: "Sanket" }, { person: "Om" }],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Expense.deleteMany({});
    console.log("Cleared existing expenses");

    // Insert test data
    await Expense.insertMany(testData);
    console.log("Test data inserted successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
