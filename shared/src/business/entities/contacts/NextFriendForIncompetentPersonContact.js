const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the NextFriendForIncompetentPersonContact entity
 */
exports.getNextFriendForIncompetentPersonContact = ContactFactory.createContactFactory(
  {
    additionalErrorMappings: {
      secondaryName: 'Name of Next Friend is a required field.',
    },
    additionalValidation: {
      secondaryName: joi.string().required(),
    },
  },
);
