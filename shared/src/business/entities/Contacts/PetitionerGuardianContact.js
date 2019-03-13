const { createContactFactory } = require('./PetitionContact');

/**
 * returns the constructor used for creating the PetitionerGuardianContact entity
 */
exports.getPetitionerGuardianContact = createContactFactory({
  additionalErrorMappings: {
    name: 'Name of Guardian is a required field.',
  },
  additionalValidation: {},
});
