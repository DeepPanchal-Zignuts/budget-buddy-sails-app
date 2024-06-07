const { bcrypt, saltRounds } = require('../../config/constants');

module.exports = {
  friendlyName: 'Hash password',

  description:
    'This method is used to hash the password before storing into the database',

  inputs: {
    password: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'password hashed successfully',
    },
  },

  fn: async (inputs, exits) => {
    try {
      // Hashing the password using Salt Rounds
      const hashedPassword = await bcrypt.hash(inputs.password, saltRounds);
      return exits.success(hashedPassword);
    } catch (error) {
      console.log(error);
      return exits.error(error.message);
    }
  },
};
