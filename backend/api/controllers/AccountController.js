// Imports
const { HTTP_STATUS } = require('../../config/constants');

// Exports
module.exports = {
  // Creating Account
  createAccount: async (req, res) => {
    try {
      const { name, balance, owner } = req.body;

      // Create new account
      const newAccount = await Account.create({ name, balance, owner });

      // Account Created Successfully
      return res.status(HTTP_STATUS.CREATED).send({
        success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
        message: req.i18n.__('MESSAGES.ACCOUNT_CREATE_SUCCESS'),
        newAccount,
      });
    } catch (error) {
      // Server Error
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.ACCOUNT_CREATING_ERROR'),
        error,
      });
    }
  },

  // Fetching All Accounts
  getAllAccounts: async (req, res) => {
    try {
      const id = req.params.id;

      // Find the account with its owner
      const accounts = await Account.find({ owner: id });

      // If Account not found
      if (!accounts) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.NO_ACCOUNTS_FOUND'),
        });
      }

      // Accounts Fetched Successfully
      return res.status(HTTP_STATUS.SUCCESS).send({
        success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
        message: req.i18n.__('MESSAGES.ACCOUNT_FETCH_SUCCESS'),
        accounts,
      });
    } catch (error) {
      // Server Error
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.ACCOUNT_FETCHING_ERROR'),
        error,
      });
    }
  },

  // Updating Account
  updateAccount: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, balance } = req.body;

      // Verify if the account with the given id exists
      const existingAccount = await Account.findOne({ _id: id });

      // If Account not found
      if (!existingAccount) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.ACCOUNT_NOT_FOUND'),
        });
      }

      // Update the existing account based on id
      const account = await Account.updateOne({ _id: id }).set({
        name,
        balance,
      });

      // If Account not found
      if (!account) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.NO_ACCOUNTS_FOUND'),
        });
      }

      // Account Updated Successfully
      return res.status(HTTP_STATUS.SUCCESS).send({
        success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
        message: req.i18n.__('MESSAGES.ACCOUNT_UPDATE_SUCCESS'),
        data: account,
      });
    } catch (error) {
      // Server Error
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.ACCOUNT_UPDATE_ERROR'),
        error,
      });
    }
  },

  // Deleting Account
  deleteAccount: async (req, res) => {
    try {
      const id = req.params.id;

      // Verify if the account with the given id exists
      const existingAccount = await Account.findOne({ _id: id });

      // If Account not found
      if (!existingAccount) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.ACCOUNT_NOT_FOUND'),
        });
      }

      // Find the Expenses created using this account
      const accountsExpenses = await Expense.find({
        account: existingAccount.id,
      });

      // If account has expenses then delete them from db
      if (accountsExpenses) {
        await Expense.destroy({ account: existingAccount.id });
      }

      // Deleting Account by its id
      await Account.destroyOne({ _id: id });

      // Account Deleted Successfully
      res.status(HTTP_STATUS.SUCCESS).send({
        success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
        message: req.i18n.__('MESSAGES.ACCOUNT_DELETE_SUCCESS'),
      });
    } catch (error) {
      // Server Error
      res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.ACCOUNT_DELETING_ERROR'),
        error,
      });
    }
  },
};
