const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const { ContactFactory } = require('./ContactFactory');
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
