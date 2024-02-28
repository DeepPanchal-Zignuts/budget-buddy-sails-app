// Imports
const { messages, success, HTTP_STATUS } = require('../../config/constants');

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
        success: success.SuccessTrue,
        message: messages.AccountCreateSuccess,
        newAccount,
      });
    } catch (error) {
      // Server Error
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: false,
        message: messages.AccountCreatingError,
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
          success: success.SuccessFalse,
          message: messages.NoAccountsFound,
        });
      }

      // Accounts Fetched Successfully
      return res.status(HTTP_STATUS.SUCCESS).send({
        success: success.SuccessTrue,
        message: messages.AccountFetchSuccess,
        accounts,
      });
    } catch (error) {
      // Server Error
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: success.SuccessFalse,
        message: messages.AccountFetchingError,
        error,
      });
    }
  },

  // Updating Account
  updateAccount: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, balance } = req.body;

      // Update the existing account based on id
      const account = await Account.updateOne({ _id: id }).set({
        name,
        balance,
      });

      // If Account not found
      if (!account) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: success.SuccessFalse,
          message: messages.NoAccountsFound,
        });
      }

      // Account Updated Successfully
      return res.status(HTTP_STATUS.SUCCESS).send({
        success: success.SuccessTrue,
        message: messages.AccountUpdateSuccess,
        data: account,
      });
    } catch (error) {
      // Server Error
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: success.SuccessFalse,
        message: messages.AccountUpdateError,
        error,
      });
    }
  },

  // Deleting Account
  deleteAccount: async (req, res) => {
    try {
      const id = req.params.id;

      // Deleting Account by its id
      await Account.destroyOne({ _id: id });

      // Account Deleted Successfully
      res.status(HTTP_STATUS.SUCCESS).send({
        success: success.SuccessTrue,
        message: messages.AccountDeleteSuccess,
      });
    } catch (error) {
      // Server Error
      res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: success.SuccessFalse,
        message: messages.AccountDeletingError,
        error,
      });
    }
  },
};
