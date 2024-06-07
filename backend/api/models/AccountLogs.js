/**
 * AccountLogs.js
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
    name: {
      type: 'string',
    },
    accountId: {
      model: 'account',
    },
    userId: {
      model: 'user',
    },
    amount: {
      type: 'number',
      required: true,
    },
    type: {
      type: 'string',
      required: true,
    },
    isDeleted: {
      type: 'boolean',
      defaultsTo: false,
    },
  },
};
