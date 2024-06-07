/**
 * Account.js
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
    ownerId: {
      model: 'user',
    },
    transactions: {
      type: 'ref',
      defaultsTo: [],
    },
    balance: {
      type: 'number',
      required: true,
    },
    weeklyLimit: {
      type: 'number',
    },
    currency: {
      type: 'string',
      isIn: ['USD', 'EUR', 'YUAN', 'RUB', 'INR'],
      defaultsTo: 'INR',
    },
    isWeeklyLimitReached: {
      type: 'boolean',
      defaultsTo: false,
    },
    isDeleted: {
      type: 'boolean',
      defaultsTo: false,
    },
  },
};
