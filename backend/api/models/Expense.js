/**
 * Expense.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  dontUseObjectIds: true,
  attributes: {
    id: {
      type: 'string',
      unique: true,
      required: true,
    },
    subject: {
      type: 'string',
    },
    accountId: {
      model: 'account',
    },
    amount: {
      type: 'number',
      required: true,
    },
    category: {
      type: 'string',
      required: true,
    },
    type: {
      type: 'string',
      required: true,
    },
    details: {
      type: 'string',
    },
    date: {
      type: 'ref',
      columnType: 'datetime',
      required: true,
    },
    isPending: {
      type: 'boolean',
      defaultsTo: false,
    },
    isDeleted: {
      type: 'boolean',
      defaultsTo: false,
    },
  },

  /**
   * @name checkWeeklyLimit
   * @file Expense.js
   * @param accountData
   * @description This method is check if the expense amount is above weekly limit or not
   * @author Deep Panchal
   */

  checkWeeklyLimit: async (account, expenses) => {
    try {
      const limitReachedAccounts = [];
      let isLimitReached = false;
      let totalExpenses = 0;

      // Iterate through the expenses and sum up based on type
      expenses.forEach((expense) => {
        if (expense.type === 'expense') {
          totalExpenses += expense.amount;
        } else if (expense.type === 'income') {
          totalExpenses -= expense.amount;
        }
      });

      // Check if the total expenses exceed or equal the weekly limit
      if (
        limitReachedAccounts.length < 1 &&
        totalExpenses >= account.weeklyLimit
      ) {
        limitReachedAccounts.push(account);
        isLimitReached = true;
        return { limitReachedAccounts, isLimitReached };
      }
      return { limitReachedAccounts, isLimitReached };
    } catch (error) {
      console.error(error);
      return { limitReachedAccounts: [], isLimitReached: false };
    }
  },
};
