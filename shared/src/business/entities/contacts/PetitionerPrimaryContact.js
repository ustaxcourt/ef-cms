const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerPrimaryContact entity
 */
exports.getPetitionerPrimaryContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {},
  additionalValidation: {},
  contactName: 'PetitionerPrimaryContact',
});
