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
  // User Routes
  'POST /api/v1/auth/register': 'UserController.register',
  'POST /api/v1/auth/login': 'UserController.login',
  'GET /api/v1/auth/user-auth': 'UserController.private',

  // Account Routes
  'GET /api/v1/account/get-accounts/:id': 'AccountController.getAllAccounts',
  'POST /api/v1/account/add-account': 'AccountController.createAccount',
  'PATCH /api/v1/account/update-account/:id': 'AccountController.updateAccount',
  'DELETE /api/v1/account/delete-account/:id':
    'AccountController.deleteAccount',

  //Expense Routes
  'POST /api/v1/expense/add-expense': 'ExpenseController.addExpense',
  'POST /api/v1/expense/get-expense': 'ExpenseController.getAllExpense',
  'PATCH /api/v1/expense/update-expense/:id': 'ExpenseController.editExpense',
  'DELETE /api/v1/expense/delete-expense/:id':
    'ExpenseController.deleteExpense',
};
