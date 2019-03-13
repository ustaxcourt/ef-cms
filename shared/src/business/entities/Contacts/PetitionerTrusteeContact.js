const { createContactFactory } = require('./PetitionContact');

/**
 * returns the constructor used for creating the PetitionerTrusteeContact entity
 */
exports.getPetitionerTrusteeContact = createContactFactory({
  additionalErrorMappings: {
    name: 'Name of Trustee is a required field.',
  },
  additionalValidation: {},
});
