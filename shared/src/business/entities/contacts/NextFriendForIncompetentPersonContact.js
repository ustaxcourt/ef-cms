const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the NextFriendForIncompetentPersonContact entity
 */
exports.getNextFriendForIncompetentPersonContact = ContactFactory.createContactFactory(
  {
    additionalErrorMappings: {
      secondaryName: 'Enter name of next friend',
    },
    additionalValidation: {
      secondaryName: joi.string().required(),
    },
  },
);
