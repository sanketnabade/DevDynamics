const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const calculateBalances = (expenses) => {
  const balances = {};

  // Initialize balances for all people
  expenses.forEach((expense) => {
    if (!balances[expense.paid_by]) balances[expense.paid_by] = 0;
    expense.splits.forEach((split) => {
      if (!balances[split.person]) balances[split.person] = 0;
    });
  });

  // Calculate net balance for each person
  expenses.forEach((expense) => {
    // Add the full amount to the person who paid
    balances[expense.paid_by] =
      Number(balances[expense.paid_by]) + Number(expense.amount);

    if (expense.split_type === "equal") {
      // For equal splits, divide amount equally
      const splitAmount = Number(expense.amount) / expense.splits.length;
      expense.splits.forEach((split) => {
        balances[split.person] = Number(balances[split.person]) - splitAmount;
      });
    } else {
      // For exact or percentage splits, use the calculated amounts
      expense.splits.forEach((split) => {
        balances[split.person] =
          Number(balances[split.person]) - Number(split.amount || 0);
      });
    }
  });

  return Object.entries(balances).map(([person, amount]) => ({
    person,
    amount: Number(amount.toFixed(2)),
  }));
};

const calculateSettlements = (balances) => {
  const settlements = [];
  const debtors = balances
    .filter((b) => b.amount < 0)
    .sort((a, b) => a.amount - b.amount);
  const creditors = balances
    .filter((b) => b.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  while (debtors.length > 0 && creditors.length > 0) {
    const debtor = debtors[0];
    const creditor = creditors[0];

    const amount = Math.min(Math.abs(debtor.amount), creditor.amount);

    if (amount > 0) {
      settlements.push({
        from: debtor.person,
        to: creditor.person,
        amount: Number(amount.toFixed(2)),
      });
    }

    debtor.amount += amount;
    creditor.amount -= amount;

    if (Math.abs(debtor.amount) < 0.01) debtors.shift();
    if (Math.abs(creditor.amount) < 0.01) creditors.shift();
  }

  return settlements;
};

module.exports = {
  catchAsync,
  calculateBalances,
  calculateSettlements,
};
