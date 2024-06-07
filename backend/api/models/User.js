/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  dontUseObjectIds: true,
  attributes: {
    id: {
      type: 'string',
      unique: true,
      required: true,
    },
    fullName: {
      type: 'string',
    },
    email: {
      type: 'string',
      isEmail: true,
      unique: true,
      required: true,
    },
    password: {
      type: 'string',
      required: true,
      minLength: 8,
    },
    accounts: {
      type: 'ref',
      defaultsTo: [],
    },
    isDeleted: {
      type: 'boolean',
      defaultsTo: false,
    },
  },
};
