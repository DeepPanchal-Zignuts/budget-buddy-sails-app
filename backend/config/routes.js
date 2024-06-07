/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  // User Controller
  'GET /api/v1/auth/user-auth': 'UserController.privateRoute',
  'POST /api/v1/auth/register': 'UserController.signUpUser',
  'POST /api/v1/auth/login': 'UserController.signInUser',

  // Account Controller
  'POST /api/v1/account/add-account': 'AccountController.createAccount',
  'GET /api/v1/account/get-accounts/:id':
    'AccountController.getAllAccountsById',
  'PATCH /api/v1/account/update-account/:id': 'AccountController.editAccount',
  'DELETE /api/v1/account/delete-account/:id':
    'AccountController.deleteAccount',

  // Expense Controller
  'POST /api/v1/expense/add-expense': 'ExpenseController.createExpense',
  'POST /api/v1/expense/get-expense': 'ExpenseController.getAllExpenses',
  'POST /api/v1/expense/amountAnalytics': 'ExpenseController.amountAnalytics',
  'POST /api/v1/expense/weekly-trend':
    'ExpenseController.recentExpenseAndSpendingTrend',
  'PATCH /api/v1/expense/update-expense/:id': 'ExpenseController.editExpense',
  'POST /api/v1/expense/delete-expense/:id': 'ExpenseController.deleteExpense',

  // Account Logs Controller
  'GET /api/v1/account/get-accounts-logs/:id':
    'AccountLogsController.createAccountLogs',
  'DELETE /api/v1/account/delete-log/:id':
    'AccountLogsController.deleteAccountLogs',
};
