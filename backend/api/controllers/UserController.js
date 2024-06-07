/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { newUuid, HTTP_STATUS, bcrypt, JWT } = require('../../config/constants');
module.exports = {
  /**
   * @name signUpUser
   * @file UserController.js
   * @param {Request} req
   * @param {Response} res
   * @description This method is used to sign-up Users
   * @author Deep Panchal
   */

  signUpUser: async (req, res) => {
    try {
      // User data object
      let userData = {
        id: newUuid,
        fullName: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };

      // If user enters email & password then hash the password
      if (userData.password && userData.email) {
        // Validate the password with regex
        const regex = /^.{6,}$/;
        if (!regex.test(userData.password)) {
          return res.status(HTTP_STATUS.BAD_REQUEST).send({
            success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
            message: req.i18n.__('MESSAGES.PASSWORD_LENGTH_ERROR'),
            data: {},
          });
        }

        // Hash the password
        const password = userData.password;
        const hashedPassword = await sails.helpers.hashPassword(password);
        userData.password = hashedPassword;
      } else {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.CREDENTIALS_REQUIRED'),
          data: {},
        });
      }

      // Check for existing user
      const existingUser = await User.findOne({ email: userData.email });

      // If it is a new user then register
      if (!existingUser) {
        const newUser = await User.create(userData).fetch();
        return res.status(HTTP_STATUS.CREATED).send({
          success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
          message: req.i18n.__('MESSAGES.REGISTRATION_SUCCESS'),
          data: newUser,
        });
      } else {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.ALREADY_USER'),
          data: {},
        });
      }
    } catch (error) {
      if (error.code === 'E_INVALID_NEW_RECORD') {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.INVALID_CREDENTIALS'),
          data: {},
        });
      }
      console.log(error);
      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.REGISTRATION_ERROR'),
        error,
      });
    }
  },

  /**
   * @name signInUser
   * @file UserController.js
   * @param {Request} req
   * @param {Response} res
   * @description This method is used to sign-in Users
   * @author Deep Panchal
   */

  signInUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check for User Existance
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.USER_NOT_FOUND'),
          data: {},
        });
      }

      // Compare Password
      const isPasswordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );

      // If passwords didn't matched
      if (!isPasswordMatch) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.INVALID_CREDENTIALS'),
        });
      }

      // Generate Token
      const token = await JWT.sign(
        { _id: existingUser.id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '7d' }
      );

      return res.status(HTTP_STATUS.SUCCESS).send({
        success: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
        message: req.i18n.__('MESSAGES.LOGIN_SUCCESS'),
        data: existingUser,
        token,
      });
    } catch (error) {
      if (error.code === 'E_INVALID_NEW_RECORD') {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
          message: req.i18n.__('MESSAGES.INVALID_CREDENTIALS'),
          data: {},
        });
      }
      console.log(error);
      // Return error exit for other types of errors
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.LOGIN_ERROR'),
        error,
      });
    }
  },

  /**
   * @name privateRoute
   * @file UserController.js
   * @param {Request} req
   * @param {Response} res
   * @description This method is used to make user access private routes
   * @author Deep Panchal
   */
  privateRoute: async (req, res) => {
    return res.status(HTTP_STATUS.SUCCESS).send({
      ok: req.i18n.__('SUCCESS.SUCCESS_TRUE'),
    });
  },
};
