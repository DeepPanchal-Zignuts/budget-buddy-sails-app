/**
 * AccountLogsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { HTTP_STATUS } = require('../../config/constants');

module.exports = {
  /**
   * @name createAccountLogs
   * @file AccountLogsController.js
   * @param {Request} req
   * @param {Response} res
   * @description This method is used to create account logs for recent activity
   * @author Deep Panchal
   */

  createAccountLogs: async (req, res) => {
    try {
      let income = 0;
      let expense = 0;
      const userId = req.params.id;

      // Find the accountLogs from the database
      const accountLog = await AccountLogs.find({
        userId,
        isDeleted: false,
      }).sort([{ createdAt: 'DESC' }]);

      // Fetch the recent accountLog created
      const account = accountLog[0];


      if (account) {
        // Calculate the expense and income
        if (account.type === 'expense') {
          expense += account.amount;
        } else if (account.type === 'income') {
          income += account.amount;
        }

        // Call the helper to compute the profit/loss percentage
        const percent = await sails.helpers.calculateProfitLoss(
          account.accountId,
          expense,
          income
        );

        // Store the expense type and account id
        const type = expense ? 'expense' : 'income';
        const accountId = account.accountId;

        // Success Response
        if (accountLog) {
          return res.status(HTTP_STATUS.SUCCESS).send({
            success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
            message: req.i18n.__('MESSAGES.ACCOUNT_FETCH_SUCCESS'),
            data: { accountLog, percent, accountId, type },
          });
        }
      }
    } catch (error) {
      console.log(error);
      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.ACCOUNT_ANALYSIS_FAILED'),
        error,
      });
    }
  },

  /**
   * @name deleteAccountLogs
   * @file AccountLogsController.js
   * @param {Request} req
   * @param {Response} res
   * @description This method will delete the account logs
   * @author Deep Panchal
   */

  deleteAccountLogs: async (req, res) => {
    try {
      const accountId = req.params.id;

      if (accountId) {
        const accountLogToDelete = await AccountLogs.findOne(accountId);
        if (accountLogToDelete) {
          accountLogToDelete.isDeleted = true;
          await AccountLogs.updateOne(
            { _id: accountLogToDelete.id },
            accountLogToDelete
          );
          const updatedAccounts = await AccountLogs.find({
            isDeleted: false,
          }).sort([{ createdAt: 'DESC' }]);

          return res.status(HTTP_STATUS.SUCCESS).send({
            success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
            message: req.i18n.__('MESSAGES.ACCOUNT_FETCH_SUCCESS'),
            data: updatedAccounts,
          });
        } else {
          return res.status(HTTP_STATUS.BAD_REQUEST).send({
            success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
            message: req.i18n.__('MESSAGES.NO_ACCOUNTS_FOUND'),
            error,
          });
        }
      } else {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.ACCOUNT_NOT_FOUND'),
          error,
        });
      }
    } catch (error) {
      console.log(error);
      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.ERROR_DELETING_LOGS'),
        error,
      });
    }
  },
};
