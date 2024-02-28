module.exports = {
  messages: {
    //Registration Messages
    RegistrationError: 'Error in Registration!',
    RegistrationSuccess: 'User Registered Successfully',
    ValidationError: 'Error in Validation',

    // Common Messages
    InvalidCredentials: 'Invalid Email or Password!',

    //Login Messages
    LoginSuccess: 'User Login Successfully',
    LoginError: 'Error in Login',
    AuthError: 'Error in User Authentication',

    // Account Messages
    AccountCreatingError: 'Error in Creating Account!',
    AccountCreateSuccess: 'Account Created Successfully',
    AccountFetchingError: 'Error in Retreiving Accounts',
    NoAccountsFound: 'No Accounts Found!',
    AccountFetchSuccess: 'All Accounts Retreived!',
    AccountUpdateError: 'Error in Updating the Account',
    AccountUpdateSuccess: 'Account Updated Successfully',
    AccountDeletingError: 'Error in Deleting Account',
    AccountNotFound: 'Account Not Found',
    AccountDeleteSuccess: 'Account Deleted Successfully',

    //Expense Messages
    ExpenseAddedSuccess: 'Expense Added Successfully!',
    ExpenseAddingError: 'Error in Adding Expense!',
    ExpenseListingError: 'Error in Fetching Expenses',
    NoExpenseFound: 'No Expense Found!',
    ExpenseFetchedSuccess: 'All Expenses Retrieved!',
    ExpenseUpdatingError: 'Error Updating Expense',
    ExpenseUpdatingSuccess: 'Expense Updated Successfully',
    ExpenseDeleteSuccess: 'Expense Deleted Successfully',
    ExpenseDeleteError: 'Error in Deleting Expense',
  },
  success: {
    // Success Messages
    SuccessTrue: true,
    SuccessFalse: false,
  },
  salt: {
    // Salt for hashing
    SaltRounds: 10,
  },
  HTTP_STATUS: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  },
};
