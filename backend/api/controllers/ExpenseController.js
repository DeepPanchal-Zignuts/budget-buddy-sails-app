// Imports
const { messages, success, HTTP_STATUS } = require('../../config/constants');
const moment = require('moment');

// Export
module.exports = {
  // Creating Expense
  addExpense: async (req, res) => {
    try {
      const { amount, type, category, reference, description, date, account } =
        req.body;

      // Create a new expense
      const newExpense = await Expense.create({
        amount,
        type,
        category,
        reference,
        description,
        date,
        account,
      });

      // Find the account to update
      let accountToUpdate = await Account.findOne(account);

      // Update the account balance according to the entered 'type'
      if (type === 'Expense') {
        accountToUpdate.balance -= Number(amount);
      } else if (type === 'Income') {
        accountToUpdate.balance += Number(amount);
      }

      // Keep the account balance updated
      const afterUpdateAccount = await Account.updateOne({
        _id: accountToUpdate.id,
      }).set({
        balance: accountToUpdate.balance,
      });

      // Expense Created Successfully
      return res.status(HTTP_STATUS.CREATED).send({
        success: success.SuccessTrue,
        message: messages.ExpenseAddedSuccess,
        newExpense,
        afterUpdateAccount,
      });
    } catch (error) {
      // Server Error
      res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: success.SuccessFalse,
        message: messages.ExpenseAddingError,
        error,
      });
    }
  },

  // Fetching All Expenses
  getAllExpense: async function (req, res) {
    try {
      const { account, frequency, selectedDate, type } = req.body;

      // Create a query about what to find from the database
      let criteria = {
        // Only include type if it is not "all"
        ...(type !== 'all' && { type }),
        account,
      };

      // If frequency is "custom", filter expenses based on selected date range
      if (frequency === 'custom') {
        criteria.date = {
          '>=': selectedDate[0],
          '<=': selectedDate[1],
        };
      } else {
        // Calculate start date based on the selected frequency
        criteria.date = {
          '>=': moment().subtract(frequency, 'days').toDate().toISOString(),
        };
      }

      // Find expenses based on destructured attributes
      const expenses = await Expense.find(criteria);

      // If expenses not found
      if (!expenses || expenses.length === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: success.SuccessFalse,
          message: messages.NoExpenseFound,
        });
      }

      // Expenses Fetched Successfully
      return res.status(HTTP_STATUS.SUCCESS).send({
        success: success.SuccessTrue,
        message: messages.ExpenseFetchedSuccess,
        expenses,
      });
    } catch (error) {
      // Server Error
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: success.SuccessFalse,
        message: messages.ExpenseListingError,
        error: error.message,
      });
    }
  },

  // Update Expense
  editExpense: async (req, res) => {
    try {
      const { amount, type, date, category, reference, description } = req.body;
      const { id } = req.params;

      // Expense Before Updation
      const oldExpense = await Expense.findOne({ _id: id });

      // Updating the expense with new values
      const updatedExpense = await Expense.updateOne({ _id: id }).set({
        amount,
        type,
        date,
        category,
        reference,
        description,
      });

      // Calculate the difference of amount
      const amountDifference = updatedExpense.amount - oldExpense.amount;

      // Find the account to update
      let accountToUpdate = await Account.findOne(updatedExpense.account);

      // If account not found
      if (!accountToUpdate) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: success.SuccessFalse,
          message: messages.AccountNotFound,
        });
      }

      // Update the account balance according to the entered 'type'
      if (type === 'Expense') {
        accountToUpdate.balance -= amountDifference;
      } else if (type === 'Income') {
        accountToUpdate.balance += amountDifference;
      }

      // Keep the account balance updated
      const afterUpdateAccount = await Account.updateOne({
        _id: accountToUpdate.id,
      }).set({
        balance: accountToUpdate.balance,
      });

      // Updated Expense successfully
      return res.status(HTTP_STATUS.SUCCESS).send({
        success: success.SuccessTrue,
        message: messages.ExpenseUpdatingSuccess,
        updatedExpense,
        afterUpdateAccount,
      });
    } catch (error) {
      // Server Error
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: success.SuccessFalse,
        message: messages.ExpenseUpdatingError,
        error,
      });
    }
  },

  // Deleting Expense
  deleteExpense: async (req, res) => {
    try {
      const id = req.params.id;

      // Delete the expense by id
      await Expense.destroyOne({ _id: id });

      // Expense Deleted Successfully
      res.status(HTTP_STATUS.SUCCESS).send({
        success: success.SuccessTrue,
        message: messages.ExpenseDeleteSuccess,
      });
    } catch (error) {
      // Server Error
      res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: success.SuccessFalse,
        message: messages.ExpenseDeleteError,
        error,
      });
    }
  },
};
