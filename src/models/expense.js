const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    paid_by: {
      type: String,
      required: [true, "Paid by is required"],
      trim: true,
    },
    participants: [
      {
        type: String,
        trim: true,
      },
    ],
    split_type: {
      type: String,
      enum: ["equal", "exact", "percentage"],
      default: "equal",
    },
    splits: [
      {
        person: {
          type: String,
          required: true,
          trim: true,
        },
        amount: Number,
        percentage: Number,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Validation middleware
expenseSchema.pre("save", function (next) {
  if (this.split_type === "exact") {
    const totalSplit = this.splits.reduce(
      (sum, split) => sum + (split.amount || 0),
      0
    );
    if (Math.abs(totalSplit - this.amount) > 0.01) {
      throw new Error("Total of exact splits must equal the expense amount");
    }
  } else if (this.split_type === "percentage") {
    const totalPercentage = this.splits.reduce(
      (sum, split) => sum + (split.percentage || 0),
      0
    );
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error("Total percentage must equal 100%");
    }
    // Calculate amounts based on percentages
    this.splits.forEach((split) => {
      split.amount = (split.percentage / 100) * this.amount;
    });
  } else {
    // equal split
    const participants =
      this.participants.length > 0
        ? this.participants
        : this.splits.map((s) => s.person);
    const splitAmount = this.amount / participants.length;
    this.splits = participants.map((person) => ({
      person,
      amount: Number(splitAmount.toFixed(2)),
    }));
  }
  next();
});

module.exports = mongoose.model("Expense", expenseSchema);
