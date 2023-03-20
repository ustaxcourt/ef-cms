const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerSpouseContact entity
 */
exports.getPetitionerSpouseContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {},
  additionalValidation: {},
  contactName: 'PetitionerSpouseContact',
});
