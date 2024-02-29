// Imports
const { HTTP_STATUS } = require('../../config/constants');
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
        success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
        message: req.i18n.__('MESSAGES.REGISTRATION_SUCCESS'),
        newUser,
      });
    } catch (error) {
      // Server Error
      if (error.code === 'E_UNIQUE') {
        // Handle unique constraint violations
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.INVALID_CREDENTIALS'),
        });
      }

      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.REGISTRATION_ERROR'),
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
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.USER_NOT_FOUND'),
        });
      }

      // Compare Passwords
      const isMatch = await bcrypt.compare(password, user.password);

      // If passwords didn't matched
      if (!isMatch) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.INVALID_CREDENTIALS'),
        });
      }

      // Generate Token
      const token = await JWT.sign(
        { _id: user.id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '7d' }
      );

      // User Login Success
      return res.status(HTTP_STATUS.SUCCESS).send({
        success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
        message: req.i18n.__('MESSAGES.LOGIN_SUCCESS'),
        user,
        token,
      });
    } catch (error) {
      // Server Error
      if (error.code === 'E_UNIQUE') {
        // Handle unique constraint violations
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.INVALID_CREDENTIALS'),
        });
      }

      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.REGISTRATION_ERROR'),
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
