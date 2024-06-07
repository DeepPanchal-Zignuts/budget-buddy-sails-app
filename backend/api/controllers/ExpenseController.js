/**
 * ExpenseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { newUuid, HTTP_STATUS, pageSize } = require('../../config/constants');

module.exports = {
  /**
   * @name createExpense
   * @file ExpenseController.js
   * @param {Request} req
   * @param {Response} res
   * @description This method is create expense under an account
   * @author Deep Panchal
   */
  createExpense: async (req, res) => {
    try {
      // Expense Data
      const expenseData = {
        id: newUuid,
        subject: req.body.subject ? req.body.subject : '-',
        accountId: req.body.accountId,
        amount: parseInt(req.body.amount),
        category: req.body.category,
        type: req.body.type,
        date: new Date(req.body.date),
        details: req.body.details ? req.body.details : '-',
        isPending: req.body.pending === 'Yes' ? true : false,
      };

      // Check if all the required fields are provided
      if (
        expenseData.accountId &&
        expenseData.amount &&
        expenseData.category &&
        expenseData.type &&
        expenseData.date
      ) {
        // Find the account in which all the operations are being done
        const accountToUpdate = await Account.findOne(expenseData.accountId);

        // If the account is present then proceed
        if (accountToUpdate) {
          // Check if the weekly limit of that account is reached or not
          const accountWithLimit = await Expense.checkWeeklyLimit(
            accountToUpdate,
            accountToUpdate.transactions
          );

          // If not then proceed with the computation of account balance
          if (accountWithLimit.isLimitReached === false) {
            if (expenseData.isPending === false) {
              if (expenseData.type === 'expense') {
                accountToUpdate.balance -= expenseData.amount;
              } else if (expenseData.type === 'income') {
                accountToUpdate.balance += expenseData.amount;
              }
            }

            // Create a new expense
            const newExpense = await Expense.create(expenseData).fetch();

            if (newExpense) {
              // Find a user to update
              const userToUpdate = await User.findOne({
                _id: accountToUpdate.ownerId,
              });

              // Find the index of the account to update in the user's accounts array
              const accountIndex = userToUpdate.accounts.findIndex(
                (account) => (account.id || account._id) === accountToUpdate.id
              );

              if (accountIndex !== -1) {
                // Update the transactions of the account
                accountToUpdate.transactions.push(newExpense);

                // Replace the old account with the updated account in the user's accounts array
                userToUpdate.accounts[accountIndex] = accountToUpdate;
              }

              const accountLogData = {
                id: newUuid,
                name: accountToUpdate.name,
                accountId: expenseData.accountId,
                userId: accountToUpdate.ownerId,
                amount: expenseData.amount,
                type: expenseData.type,
              };

              // Finally update in the database
              await Account.updateOne(
                { _id: accountToUpdate.id },
                accountToUpdate
              );
              await User.updateOne(
                { _id: accountToUpdate.ownerId },
                userToUpdate
              );

              await AccountLogs.create(accountLogData);

              return res.status(HTTP_STATUS.CREATED).send({
                success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
                message: req.i18n.__('MESSAGES.EXPENSE_ADDED_SUCCESS'),
                data: newExpense,
                afterUpdateAccount: accountToUpdate,
                user: userToUpdate,
              });
            } else {
              return res.status(HTTP_STATUS.BAD_REQUEST).send({
                success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
                message: req.i18n.__('MESSAGES.EXPENSE_ADDING_ERROR'),
                data: {},
              });
            }
          } else {
            return res.status(HTTP_STATUS.BAD_REQUEST).send({
              success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
              message: `Your weekly limit for ${accountWithLimit.limitReachedAccounts[0].name} is exceeded!`,
              data: {},
            });
          }
        } else {
          return res.status(HTTP_STATUS.NOT_FOUND).send({
            success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
            message: req.i18n.__('MESSAGES.NO_ACCOUNTS_FOUND'),
            data: {},
          });
        }
      } else {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.CREDENTIALS_NEEDED'),
          data: {},
        });
      }
    } catch (error) {
      if (error.code === 'E_UNIQUE') {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.ADD_DIFF_EXPENSE'),
          data: {},
        });
      }
      console.log(error);
      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.EXPENSE_ADDING_ERROR'),
        error,
      });
    }
  },
  /**
   * @name getAllExpenses
   * @file ExpenseController.js
   * @param {Request} req
   * @param {Response} res
   * @description This method is create expense under an account
   * @author Deep Panchal
   */
  getAllExpenses: async (req, res) => {
    try {
      // Expense Data
      const expenseData = {
        accountId: req.body.accountId,
        frequency: req.body.frequency,
        type: req.body.type,
      };

      if (expenseData.accountId) {
        // If accountId is true then compute the page for pagination
        const page = req.body.page || 1;
        const perPage = pageSize;
        const skip = (page - 1) * perPage;
        const { accountId, type, frequency } = expenseData;

        // Create a query about what to find from the database
        let criteria = {
          accountId,
          ...(type !== 'all' && { type }),
          isDeleted: false,
        };

        let sortOrder = {};

        // If frequency is "custom", filter expenses based on selected date range
        if (frequency === 'ASC') {
          sortOrder = [{ createdAt: 'ASC' }];
        } else if (frequency === 'DESC') {
          sortOrder = [{ createdAt: 'DESC' }];
        }

        // Fetch the expenses according to the criteria
        const fetchedExpenses = await Expense.find(criteria)
          .sort(sortOrder)
          .skip(skip)
          .limit(perPage);

        // Success Response
        return res.status(HTTP_STATUS.SUCCESS).send({
          success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
          message: req.i18n.__('MESSAGES.EXPENSE_FETCHED_SUCCESS'),
          data: fetchedExpenses,
        });
      } else {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.NO_ACCOUNTS_FOUND'),
          data: {},
        });
      }
    } catch (error) {
      if (error.code === 'E_UNIQUE') {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.ADD_DIFF_EXPENSE'),
          data: {},
        });
      }
      console.log(error);
      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.EXPENSE_LISTING_ERROR'),
        error,
      });
    }
  },
  /**
   * @name editExpense
   * @file ExpenseController.js
   * @param {Request} req
   * @param {Response} res
   * @description This method will update the expense
   * @author Deep Panchal
   */
  editExpense: async (req, res) => {
    try {
      // Edit Expense Data
      const expenseData = {
        subject: req.body.subject ? req.body.subject : '-',
        amount: parseInt(req.body.amount),
        category: req.body.category,
        type: req.body.type,
        date: new Date(req.body.date),
        details: req.body.details ? req.body.details : '-',
        isPending: req.body.pending === 'Yes' ? true : false,
      };

      const expenseId = req.params.id;

      // If expenseId is true, find the oldExpense
      if (expenseId) {
        // Expense before updation
        const oldExpense = await Expense.findOne({ _id: expenseId });

        // If old expense not found
        if (!oldExpense) {
          return res.status(HTTP_STATUS.NOT_FOUND).send({
            success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
            message: req.i18n.__('MESSAGES.EXPENSE_NOT_FOUND'),
            data: {},
          });
        }

        // Find the account to update
        const accountToUpdate = await Account.findOne({
          _id: oldExpense.accountId,
        });

        // If account not found
        if (!accountToUpdate) {
          return res.status(HTTP_STATUS.NOT_FOUND).send({
            success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
            message: req.i18n.__('MESSAGES.ACCOUNT_NOT_FOUND'),
            data: {},
          });
        }

        // Find the user to update
        const userToUpdate = await User.findOne({
          _id: accountToUpdate.ownerId,
        });

        // If user not found
        if (!userToUpdate) {
          return res.status(HTTP_STATUS.NOT_FOUND).send({
            success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
            message: req.i18n.__('MESSAGES.USER_NOT_FOUND'),
            data: {},
          });
        }

        // Now update the expense which was supposed to
        const updatedExpense = await Expense.updateOne(
          { _id: expenseId },
          expenseData
        );

        // Calculate the difference of amount
        const amountDifference = updatedExpense.amount - oldExpense.amount;

        // Update the account balance according to the entered 'type'
        if (expenseData.type === 'expense') {
          accountToUpdate.balance -= amountDifference;
        } else if (expenseData.type === 'income') {
          accountToUpdate.balance += amountDifference;
        }

        // Find the index of the expense to update in the account's transactions array
        const accountIndex = accountToUpdate.transactions.findIndex(
          (expense) => (expense.id || expense._id) === updatedExpense.id
        );

        // Find the index of the account to update in the user's accounts array
        const userAccountIndex = userToUpdate.accounts.findIndex(
          (account) => (account.id || account._id) === accountToUpdate.id
        );

        if (accountIndex !== -1) {
          // Update the transactions of the account
          accountToUpdate.transactions[accountIndex] = updatedExpense;

          // Replace the old account with the updated account in the user's accounts array
          userToUpdate.accounts[userAccountIndex] = accountToUpdate;
        }

        // Keep the account balance updated
        const afterUpdateAccount = await Account.updateOne(
          {
            _id: accountToUpdate.id,
          },
          accountToUpdate
        );

        // Keep the user's account array updated
        await User.updateOne({ _id: accountToUpdate.ownerId }, userToUpdate);

        // Success Response
        return res.status(HTTP_STATUS.SUCCESS).send({
          success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
          message: req.i18n.__('MESSAGES.EXPENSE_UPDATING_SUCCESS'),
          afterUpdateAccount,
        });
      } else {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.EXPENSE_NOT_FOUND'),
          data: {},
        });
      }
    } catch (error) {
      if (error.code === 'E_UNIQUE') {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.ADD_DIFF_EXPENSE'),
          data: {},
        });
      }
      console.log(error);
      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.EXPENSE_LISTING_ERROR'),
        error,
      });
    }
  },
  /**
   * @name amountAnalytics
   * @file ExpenseController.js
   * @param {Request} req
   * @param {Response} res
   * @description This method analysis the expense/income and weekly limit for expenses
   * @author Deep Panchal
   */
  amountAnalytics: async (req, res) => {
    try {
      // Take the accountId
      const accountId = req.body.accountId;
      let totalIncome = 0;
      let totalExpense = 0;
      let allExpenses = [];
      let allIncomes = [];

      // Find the account from the accountId
      const account = await Account.findOne(accountId);

      if (account) {
        // Extract all the expenses from transactions array
        const expenses = account.transactions;
        if (expenses) {
          // Compute the totalExpense and totalIncome
          expenses.forEach((expense) => {
            if (expense.type === 'income' && expense.isDeleted === false) {
              totalIncome += expense.amount;
              allIncomes.push(expense);
            } else if (
              expense.type === 'expense' &&
              expense.isDeleted === false
            ) {
              totalExpense += expense.amount;
              allExpenses.push(expense);
            }
          });

          // Thenafter, calculate the weekly limit
          const percentageUsed = await sails.helpers.calculateLimit(
            account.weeklyLimit,
            allExpenses,
            allIncomes
          );

          // Success Response
          return res.status(HTTP_STATUS.SUCCESS).send({
            success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
            message: req.i18n.__('MESSAGES.ANALYSIS_COMPLETED'),
            data: { totalIncome, totalExpense, percentageUsed },
          });
        } else {
          return res.status(HTTP_STATUS.BAD_REQUEST).send({
            success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
            message: req.i18n.__('MESSAGES.PLEASE_ADD_EXPENSE'),
            data: {},
          });
        }
      } else {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.NO_ACCOUNTS_FOUND'),
          data: {},
        });
      }
    } catch (error) {
      if (error.code === 'E_UNIQUE') {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.ADD_DIFF_EXPENSE'),
          data: {},
        });
      }
      console.log(error);
      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.EXPENSE_ANALYSIS_FAILED'),
        error,
      });
    }
  },
  /**
   * @name recentExpenseAndSpendingTrend
   * @file ExpenseController.js
   * @param {Request} req
   * @param {Response} res
   * @description This method finds the weekly Spending Limit and Recent expenses
   * @author Deep Panchal
   */
  recentExpenseAndSpendingTrend: async (req, res) => {
    try {
      // Store the account id and weekday array for further computation
      const accountId = req.body.accountId;
      let totalIncome = 0;
      let totalExpense = 0;
      let allExpenses = [];
      let allIncomes = [];
      const weekday = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      // Create a graph structure
      const graphData = weekday.map((day) => ({ day, expense: 0, income: 0 }));

      // Find the account from the accountId
      const account = await Account.findOne(accountId);

      // If account is there then fetch the expenses
      if (account) {
        const expenses = await Expense.find({ accountId: accountId }).sort([
          { createdAt: 'DESC' },
        ]);

        // Now find the index of the day in dayIndex
        expenses.forEach((transaction) => {
          const dayIndex = new Date(transaction.date).getDay();

          // Find the days of their consecutive index
          const dayData = graphData[dayIndex];

          // Find the expense and income for each day
          if (
            transaction.type === 'expense' &&
            transaction.isDeleted === false
          ) {
            dayData.expense += transaction.amount;
            totalExpense += transaction.amount;
            allExpenses.push(transaction);
          } else if (
            transaction.type === 'income' &&
            transaction.isDeleted === false
          ) {
            dayData.income += transaction.amount;
            totalIncome += transaction.amount;
            allIncomes.push(transaction);
          }
        });

        // Thenafter, calculate the weekly limit
        const percentageUsed = await sails.helpers.calculateLimit(
          account.weeklyLimit,
          allExpenses,
          allIncomes
        );

        // Success Response
        return res.status(HTTP_STATUS.SUCCESS).send({
          success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
          message: req.i18n.__('MESSAGES.ANALYSIS_COMPLETED'),
          data: { expenses, graphData, percentageUsed },
        });
      }
    } catch (error) {
      if (error.code === 'E_UNIQUE') {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.ADD_DIFF_EXPENSE'),
          data: {},
        });
      }
      console.log(error);
      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.EXPENSE_ANALYSIS_FAILED'),
        error,
      });
    }
  },
  /**
   * @name deleteExpense
   * @file ExpenseController.js
   * @param {Request} req
   * @param {Response} res
   * @description This method will delete the expense
   * @author Deep Panchal
   */
  deleteExpense: async (req, res) => {
    try {
      const expenseId = req.params.id;

      if (expenseId) {
        const existingExpense = await Expense.findOne({ _id: expenseId });

        if (existingExpense) {
          // Find the account to update
          let accountToUpdate = await Account.findOne({
            _id: existingExpense.accountId,
          });

          // Find the user to update
          const userToUpdate = await User.findOne({
            _id: accountToUpdate.ownerId,
          });

          // Update the account balance according to the entered 'type'
          if (existingExpense.type === 'expense') {
            accountToUpdate.balance += existingExpense.amount;
          } else if (existingExpense.type === 'income') {
            accountToUpdate.balance -= existingExpense.amount;
          }

          existingExpense.isDeleted = true;

          // Find the index of the expense to update in the account's transactions array
          const accountIndex = accountToUpdate.transactions.findIndex(
            (expense) => (expense.id || expense._id) === existingExpense.id
          );

          // Find the index of the account to update in the user's accounts array
          const userAccountIndex = userToUpdate.accounts.findIndex(
            (account) => (account.id || account._id) === accountToUpdate.id
          );

          if (accountIndex !== -1) {
            // Update the transactions of the account
            accountToUpdate.transactions[accountIndex] = existingExpense;

            // Replace the old account with the updated account in the user's accounts array
            userToUpdate.accounts[userAccountIndex] = accountToUpdate;
          }

          // Keep the account balance updated
          const afterUpdateAccount = await Account.updateOne(
            {
              _id: accountToUpdate.id,
            },
            accountToUpdate
          );

          // Keep the user's account array updated
          await User.updateOne({ _id: accountToUpdate.ownerId }, userToUpdate);

          await Expense.updateOne({ _id: expenseId }, existingExpense);

          // Success Response
          return res.status(HTTP_STATUS.SUCCESS).send({
            success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
            message: req.i18n.__('MESSAGES.EXPENSE_DELETE_SUCCESS'),
            afterUpdateAccount,
          });
        } else {
          return res.status(HTTP_STATUS.NOT_FOUND).send({
            success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
            message: req.i18n.__('MESSAGES.EXPENSE_NOT_FOUND'),
            data: {},
          });
        }
      } else {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.EXPENSE_NOT_FOUND'),
          data: {},
        });
      }
    } catch (error) {
      if (error.code === 'E_UNIQUE') {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.ADD_DIFF_EXPENSE'),
          data: {},
        });
      }
      console.log(error);
      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.EXPENSE_DELETE_ERROR'),
        error,
      });
    }
  },
};
