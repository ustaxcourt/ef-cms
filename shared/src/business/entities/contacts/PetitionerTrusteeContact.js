const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerTrusteeContact entity
 */
exports.getPetitionerTrusteeContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    name: 'Name of Trustee is a required field.',
  },
  additionalValidation: {},
});
