// Imports
const { HTTP_STATUS } = require('../../config/constants');

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
        success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
        message: req.i18n.__('MESSAGES.EXPENSE_ADDED_SUCCESS'),
        newExpense,
        afterUpdateAccount,
      });
    } catch (error) {
      // Server Error
      res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.EXPENSE_ADDING_ERROR'),
        error,
      });
    }
  },

  // Fetching All Expenses
  getAllExpense: async function (req, res) {
    try {
      const { account, frequency, selectedDate, type } = req.body;

      const page = req.body.page || 1;

      const perPage = req.i18n.__('PAGEINATION.PAGE_SIZE');

      const skip = (page - 1) * perPage;

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
      }

      // Find expenses based on destructured attributes
      const expenses = await Expense.find(criteria).skip(skip).limit(perPage);

      // If expenses not found
      if (!expenses || expenses.length === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.NO_EXPENSE_FOUND'),
        });
      }

      // Expenses Fetched Successfully
      return res.status(HTTP_STATUS.SUCCESS).send({
        success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
        message: req.i18n.__('MESSAGES.EXPENSE_FETCHED_SUCCESS'),
        expenses,
      });
    } catch (error) {
      // Server Error
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.EXPENSE_LISTING_ERROR'),
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

      // If Old Expense not found
      if (!oldExpense) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.NO_EXPENSE_FOUND'),
        });
      }

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
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.ACCOUNT_NOT_FOUND'),
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
        success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
        message: req.i18n.__('MESSAGES.EXPENSE_UPDATING_SUCCESS'),
        updatedExpense,
        afterUpdateAccount,
      });
    } catch (error) {
      // Server Error
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.EXPENSE_UPDATING_ERROR'),
        error,
      });
    }
  },

  // Deleting Expense
  deleteExpense: async (req, res) => {
    try {
      const id = req.params.id;

      // Verify if the account with the given id exists
      const existingExpense = await Expense.findOne({ _id: id });

      // If Account not found
      if (!existingExpense) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.EXPENSE_NOT_FOUND'),
        });
      }

      // Find the account to update
      let accountToUpdate = await Account.findOne(existingExpense.account);

      // Update the account balance according to the entered 'type'
      if (existingExpense.type === 'Expense') {
        accountToUpdate.balance += Number(existingExpense.amount);
      } else if (existingExpense.type === 'Income') {
        accountToUpdate.balance -= Number(existingExpense.amount);
      }

      // Keep the account balance updated
      const afterUpdateAccount = await Account.updateOne({
        _id: accountToUpdate.id,
      }).set({
        balance: accountToUpdate.balance,
      });

      // Delete the expense by id
      await Expense.destroyOne({ _id: id });

      // Expense Deleted Successfully
      return res.status(HTTP_STATUS.SUCCESS).send({
        success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
        message: req.i18n.__('MESSAGES.EXPENSE_DELETE_SUCCESS'),
        afterUpdateAccount,
      });
    } catch (error) {
      // Server Error
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.EXPENSE_DELETE_ERROR'),
        error,
      });
    }
  },
};
