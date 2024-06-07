require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const newUuid = uuidv4();
const JWT = require('jsonwebtoken');
const moment = require('moment');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const pageSize = 6;

module.exports = {
  HTTP_STATUS: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  },
  newUuid,
  JWT,
  saltRounds,
  pageSize,
  moment: moment,
  bcrypt,
};
