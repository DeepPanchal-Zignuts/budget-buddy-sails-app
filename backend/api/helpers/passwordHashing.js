const { salt } = require('../../config/constants');
const bcrypt = require('bcrypt');

module.exports = {
  friendlyName: 'hash Password',

  description: 'Hash the password before storing into database',

  inputs: {
    password: {
      type: 'string',
      description: 'Password entered by user during registration',
      requierd: true,
    },
  },

  fn: async (inputs) => {
    try {
      // Hashing the password using Salt Rounds
      const hashedPassword = await bcrypt.hash(
        inputs.password,
        salt.SaltRounds
      );

      return hashedPassword;
    } catch (error) {
      throw new Error('Error in hashin the password', error);
    }
  },
};
