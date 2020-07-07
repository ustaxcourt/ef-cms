const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the OtherPetitionerContact entity
 */
exports.getOtherPetitionerContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {},
  additionalValidation: {},
  contactName: 'OtherPetitionerContact',
});
