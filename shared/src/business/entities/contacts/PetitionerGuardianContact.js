const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerGuardianContact entity
 */
exports.getPetitionerGuardianContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    name: 'Name of Guardian is a required field.',
  },
  additionalValidation: {},
});
