const { createContactFactory } = require('./PetitionContact');

/**
 * returns the constructor used for creating the PetitionerCustodianContact entity
 */
exports.getPetitionerCustodianContact = createContactFactory({
  additionalErrorMappings: { name: 'Name of Custodian a required field.' },
  additionalValidation: {},
});
