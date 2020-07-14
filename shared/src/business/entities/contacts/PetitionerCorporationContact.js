const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerCorporationContact entity
 */
exports.getPetitionerCorporationContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {},
  additionalValidation: {},
  contactName: 'PetitionerCorporationContact',
});
