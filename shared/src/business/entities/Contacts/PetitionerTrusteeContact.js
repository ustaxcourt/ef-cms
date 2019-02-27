const { createContactFactory } = require('./PetitionContact');

exports.getPetitionerTrusteeContact = createContactFactory({
  additionalErrorMappings: {
    name: 'Name of Trustee is a required field.',
  },
  additionalValidation: {},
});
