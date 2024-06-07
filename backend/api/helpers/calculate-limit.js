module.exports = {
  friendlyName: 'Calculate Limit',

  description: 'This method will calculate the percentage of weekly limit used',

  inputs: {
    weeklyLimit: {
      type: 'number',
    },
    allExpenses: {
      type: 'ref',
    },
    allIncomes: {
      type: 'ref',
    },
  },

  exits: {
    success: {
      description: 'Percentage calculated success!',
    },
  },

  fn: async (inputs, exits) => {
    try {
      // Calculate the total expenses
      const totalExpenses = inputs.allExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      // Calculate the percentage of the weekly limit used
      const percentageUsed = Math.min(
        (totalExpenses / inputs.weeklyLimit) * 100,
        100
      ).toFixed(1);

      return exits.success(parseFloat(percentageUsed));
    } catch (error) {
      console.log(error);
      return exits.error(error.message);
    }
  },
};
