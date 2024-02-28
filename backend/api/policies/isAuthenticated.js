// Imports
const JWT = require('jsonwebtoken');
const { messages, success, HTTP_STATUS } = require('../../config/constants');

// Export
module.exports = async (req, res, proceed) => {
  try {
    // Verifying the Token
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY
    );
    req.user = decode;
    // Calling the Next function
    return proceed();
  } catch (error) {
    // Server Error
    return res.status(HTTP_STATUS.SERVER_ERROR).send({
      success: success.SuccessFalse,
      message: messages.AuthError,
      error,
    });
  }
};
