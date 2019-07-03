const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerCustodianContact entity
 */
exports.getPetitionerCustodianContact = ContactFactory.createContactFactory({
  additionalErrorMappings: { name: 'Name of Custodian a required field.' },
  additionalValidation: {},
});
