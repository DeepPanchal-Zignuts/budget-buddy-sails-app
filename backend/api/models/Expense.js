/**
 * Expense.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    amount: {
      type: 'number',
      required: true,
    },
    type: {
      type: 'string',
      required: true,
    },
    category: {
      type: 'string',
      required: true,
    },
    reference: {
      type: 'string',
    },
    description: {
      type: 'string',
      required: true,
    },
    date: {
      type: 'ref',
      columnType: 'datetime',
      required: true,
    },
    account: {
      model: 'Account',
      required: true,
    },
  },
};
