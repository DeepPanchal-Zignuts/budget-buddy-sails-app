// Imports
const { HTTP_STATUS, JWT } = require('../../config/constants');

// Export
module.exports = async (req, res, proceed) => {
  try {
    // Verifying the Token
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY
    );

    // check for user by id
    const isExistingUser = await User.findOne({ _id: decode._id });

    // If user not exists
    if (!isExistingUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).send({
        success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
        message: req.i18n.__('MESSAGES.USER_NOT_FOUND'),
      });
    }

    req.user = decode;
    // Calling the Next function
    return proceed();
  } catch (error) {
    // Server Error
    return res.status(HTTP_STATUS.SERVER_ERROR).send({
      success: req.i18n.__('SUCCESS.SUCCESS_FALSE'),
      message: req.i18n.__('MESSAGES.AUTH_ERROR'),
      error,
    });
  }
};
