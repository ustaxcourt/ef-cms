const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the NextFriendForMinorContact entity
 */
exports.getNextFriendForMinorContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Enter name of next friend',
  },
  additionalValidation: {
    secondaryName: joi.string().required(),
  },
});
