/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { newUuid, HTTP_STATUS } = require('../../config/constants');

module.exports = {
  /**
   * @name createAccount
   * @file AccountController.js
   * @param {Request} req
   * @param {Response} res
   * @description This method is create accounts under a user
   * @author Deep Panchal
   */
  createAccount: async (req, res) => {
    try {
      // Account Data Object
      const accountData = {
        id: newUuid,
        name: req.body.name,
        ownerId: req.body.ownerId,
        balance: parseInt(req.body.balance),
        weeklyLimit: parseInt(req.body.weeklyLimit),
        currency: req.body.currency,
      };

      // If all the required fields are true
      if (accountData.name && accountData.balance && accountData.weeklyLimit) {
        // Find the owner of the account using ownerId
        const accountOwner = await User.findOne({ _id: accountData.ownerId });

        // If account owner is true then create a new account
        if (accountOwner) {
          // New account
          const newAccount = await Account.create(accountData).fetch();

          // if account is being created then push the account in owner's account array
          if (newAccount) {
            // Add the newly created account in the owner's accounts array
            accountOwner.accounts.push(newAccount);

            await User.updateOne({ _id: accountData.ownerId }, accountOwner);

            return res.status(HTTP_STATUS.CREATED).send({
              success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
              message: req.i18n.__('MESSAGES.ACCOUNT_CREATE_SUCCESS'),
              data: newAccount,
            });
          } else {
            return res.status(HTTP_STATUS.BAD_REQUEST).send({
              success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
              message: req.i18n.__('MESSAGES.ACCOUNT_CREATING_ERROR'),
              error,
            });
          }
        } else {
          return res.status(HTTP_STATUS.BAD_REQUEST).send({
            success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
            message: req.i18n.__('MESSAGES.ACCOUNT_CREATING_ERROR'),
            error,
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
      console.log(error);
      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.ACCOUNT_CREATING_ERROR'),
        error,
      });
    }
  },
  /**
   * @name getAllAccountsById
   * @file AccountController.js
   * @param {Request} req
   * @param {Response} res
   * @description This method will find accounts of a user
   * @author Deep Panchal
   */
  getAllAccountsById: async (req, res) => {
    try {
      // Fetching the owners Id
      const ownerId = req.params.id;
      let AccountsFetched = [];

      // If owner's Id is true then find accounts
      if (ownerId) {
        // Find from the account model
        const accounts = await Account.find({
          ownerId: ownerId,
          isDeleted: 'false',
        }).sort([{ createdAt: 'ASC' }]);

        AccountsFetched.push(accounts);

        // If accounts is true then find accounts from the owner
        if (accounts) {
          return res.status(HTTP_STATUS.SUCCESS).send({
            success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
            message: req.i18n.__('MESSAGES.ACCOUNT_FETCH_SUCCESS'),
            data: AccountsFetched,
          });
        } else {
          return res.status(HTTP_STATUS.NOT_FOUND).send({
            success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
            message: req.i18n.__('MESSAGES.USER_NOT_FOUND'),
            data: {},
          });
        }
      } else {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.USER_NOT_FOUND'),
          data: {},
        });
      }
    } catch (error) {
      console.log(error);
      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.ACCOUNT_FETCHING_ERROR'),
        error,
      });
    }
  },
  /**
   * @name editAccount
   * @file AccountController.js
   * @param {Request} req
   * @param {Response} res
   * @description This method will edit accounts of a user
   * @author Deep Panchal
   */
  editAccount: async (req, res) => {
    try {
      // Fetch the data
      const name = req.body.name;
      const balance = parseInt(req.body.balance);
      const accountId = req.params.id;

      // Find the account to update using accountId
      const accountToUpdate = await Account.findOne(accountId);

      if (accountToUpdate) {
        // If account is true then find the user to update
        const userToUpdate = await User.findOne({
          _id: accountToUpdate.ownerId,
        });

        // If user is found then update the name and balance of the account
        if (userToUpdate) {
          accountToUpdate.name = name;
          accountToUpdate.balance = balance;

          // Find the index of the account to update in the user's accounts array
          const userAccountIndex = userToUpdate.accounts.findIndex(
            (account) => (account.id || account._id) === accountToUpdate.id
          );

          if (userAccountIndex !== -1) {
            // Replace the old account with the updated account in the user's accounts array
            userToUpdate.accounts[userAccountIndex] = accountToUpdate;
          }

          // Update in the database
          await Account.updateOne({ _id: accountToUpdate.id }, accountToUpdate);

          await User.updateOne({ _id: accountToUpdate.ownerId }, userToUpdate);

          // Find the updated accounts array
          const allAccounts = await Account.find({ isDeleted: false });

          // Success Response
          return res.status(HTTP_STATUS.SUCCESS).send({
            success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
            message: req.i18n.__('MESSAGES.ACCOUNT_UPDATE_SUCCESS'),
            data: allAccounts,
          });
        } else {
          return res.status(HTTP_STATUS.NOT_FOUND).send({
            success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
            message: req.i18n.__('MESSAGES.USER_NOT_FOUND'),
            data: {},
          });
        }
      } else {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.ACCOUNT_NOT_FOUND'),
          data: {},
        });
      }
    } catch (error) {
      console.log(error);
      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.ACCOUNT_UPDATE_ERROR'),
        error,
      });
    }
  },

  /**
   * @name deleteAccount
   * @file AccountController.js
   * @param {Request} req
   * @param {Response} res
   * @description This method will delete accounts of a user
   * @author Deep Panchal
   */
  deleteAccount: async (req, res) => {
    try {
      // Fetch the data
      const accountId = req.params.id;

      // Find the account to delete
      const accountToDelete = await Account.findOne(accountId);

      if (accountToDelete) {
        // If account is found then find the expenses to delete of this particular account
        const expensesToDelete = await Expense.find({
          accountId: accountToDelete.id,
        });

        // If the expenses are found then delete them
        if (expensesToDelete) {
          await Expense.destroy({ accountId: accountToDelete.id });
        }

        // Find the user to update
        const userToUpdate = await User.findOne({
          _id: accountToDelete.ownerId,
        });

        // Find the index of the account to update in the user's accounts array
        const userAccountIndex = userToUpdate.accounts.findIndex(
          (account) => (account.id || account._id) === accountToDelete.id
        );

        if (userAccountIndex !== -1) {
          // Remove the account from the user's accounts array
          userToUpdate.accounts.splice(userAccountIndex, 1);

          // Update the user
          await User.updateOne({ _id: userToUpdate.id }, userToUpdate);
        }

        // Delete the account
        await Account.destroyOne({ _id: accountToDelete.id });

        // Find the updated accounts array
        const allAccounts = await Account.find({ isDeleted: false });

        // Success Response
        return res.status(HTTP_STATUS.SUCCESS).send({
          success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
          message: req.i18n.__('MESSAGES.ACCOUNT_DELETE_SUCCESS'),
          data: allAccounts,
        });
      } else {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.ACCOUNT_NOT_FOUND'),
          data: {},
        });
      }
    } catch (error) {
      console.log(error);
      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.ACCOUNT_DELETING_ERROR'),
        error,
      });
    }
  },
};
