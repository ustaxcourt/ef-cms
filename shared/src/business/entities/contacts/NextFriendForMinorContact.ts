const { ContactFactory } = require('./ContactFactory');
const { JoiValidationConstants } = require('../JoiValidationConstants');
/**
 * returns the constructor used for creating the NextFriendForMinorContact entity
 */
exports.getNextFriendForMinorContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Enter name of next friend',
  },
  additionalValidation: {
    secondaryName: JoiValidationConstants.STRING.max(500).required(),
  },
  contactName: 'NextFriendForMinorContact',
});
