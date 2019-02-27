const { createContactFactory } = require('./PetitionContact');

exports.getPetitionerCustodianContact = createContactFactory({
  additionalErrorMappings: { name: 'Name of Custodian a required field.' },
  additionalValidation: {},
});
