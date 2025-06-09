const { body } = require("express-validator");

const validateExpense = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),
  body("description").notEmpty().withMessage("Description is required").trim(),
  body("paid_by").notEmpty().withMessage("Paid by is required").trim(),
  body("split_type")
    .optional()
    .isIn(["equal", "exact", "percentage"])
    .withMessage("Invalid split type"),
  body("splits").optional().isArray().withMessage("Splits must be an array"),
  body("splits.*.person")
    .optional()
    .notEmpty()
    .withMessage("Split person is required"),
  body("splits.*.amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Split amount must be greater than or equal to 0"),
  body("splits.*.percentage")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Split percentage must be between 0 and 100"),
];

module.exports = {
  validateExpense,
};
