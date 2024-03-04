const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const passwordHashing = require('../api/helpers/passwordHashing');

module.exports = {
  HTTP_STATUS: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  },
  bcrypt,
  JWT,
  passwordHashing,
};
