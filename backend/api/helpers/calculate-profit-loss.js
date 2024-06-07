module.exports = {
  friendlyName: 'Calculate Profit Loss',

  description:
    'This method will calculate the percentage of profit and loss of a particular account',

  inputs: {
    accountId: {
      type: 'string',
    },
    newExpense: {
      type: 'number',
    },
    newIncome: {
      type: 'number',
    },
  },

  exits: {
    success: {
      description: 'Percentage calculated success!',
    },
  },

  fn: async (inputs, exits) => {
    try {
      // Find the account from the accountId
      const account = await Account.findOne(inputs.accountId);

      if (!account) {
        return exits.error('No account found');
      }
      // Store the initial balance of the account & calculate the new total
      const originalTotal = account.balance;
      const newTotal = originalTotal + inputs.newIncome - inputs.newExpense;

      // Find the profit/loss from the previous 2 values
      const profitOrLoss = newTotal - originalTotal;

      // Calculate the percentage change
      let percentageChange = 0;
      if (originalTotal !== 0) {
        percentageChange = (profitOrLoss / originalTotal) * 100;
      }

      // Ensure the percentage is within the range of -100% to 100%
      if (percentageChange > 100) {
        percentageChange = 100;
      } else if (percentageChange < -100) {
        percentageChange = -100;
      }

      // Get the percentage of 1 decimal place & allow the max limit to 100
      const profitLossPercent = parseFloat(
        Math.min(percentageChange, 100).toFixed(1)
      );

      return exits.success(profitLossPercent);
    } catch (error) {
      console.log(error);
      return exits.error(error.message);
    }
  },
};
