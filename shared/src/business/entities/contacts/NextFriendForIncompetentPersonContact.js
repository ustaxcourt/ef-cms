const joi = require('@hapi/joi');
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
      secondaryName: joi.string().max(500).required(),
    },
    contactName: 'NextFriendForIncompetentPersonContact',
  },
);
