// Imports
const { messages, success, HTTP_STATUS } = require('../../config/constants');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const passwordHashing = require('../helpers/passwordHashing');

// Export
module.exports = {
  // User Registration
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Hash the password
      const hashedPassword = await passwordHashing.fn({ password });

      // Create a new user
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      // User Registration Success
      return res.status(HTTP_STATUS.CREATED).send({
        success: success.SuccessTrue,
        message: messages.RegistrationSuccess,
        newUser,
      });
    } catch (error) {
      // Server Error
      if (error.code === 'E_UNIQUE') {
        // Handle unique constraint violations
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({
          success: success.SuccessFalse,
          message: messages.InvalidCredentials,
        });
      }

      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: success.SuccessFalse,
        message: messages.RegistrationError,
        error,
      });
    }
  },

  // User Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check for User Existance
      const user = await User.findOne({ email });

      // If User not exists
      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({
          success: success.SuccessFalse,
          message: messages.InvalidCredentials,
        });
      }

      // Compare Passwords
      const isMatch = await bcrypt.compare(password, user.password);

      // If passwords didn't matched
      if (!isMatch) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({
          success: success.SuccessFalse,
          message: messages.InvalidCredentials,
        });
      }

      // Generate Token
      const token = await JWT.sign(
        { _id: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '7d' }
      );

      // User Login Success
      return res.status(HTTP_STATUS.SUCCESS).send({
        success: success.SuccessTrue,
        message: messages.LoginSuccess,
        user,
        token,
      });
    } catch (error) {
      // Server Error
      if (error.code === 'E_UNIQUE') {
        // Handle unique constraint violations
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({
          success: success.SuccessFalse,
          message: messages.InvalidCredentials,
        });
      }

      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: success.SuccessFalse,
        message: messages.RegistrationError,
        error,
      });
    }
  },

  // Protected Route
  private: (req, res) => {
    // To make routes private
    return res.status(200).send({ ok: true });
  },
};
