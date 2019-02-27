const { createContactFactory } = require('./PetitionContact');

exports.getPetitionerGuardianContact = createContactFactory({
  additionalErrorMappings: {
    name: 'Name of Guardian is a required field.',
  },
  additionalValidation: {},
});
