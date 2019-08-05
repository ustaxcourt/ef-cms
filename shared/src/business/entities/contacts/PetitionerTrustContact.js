const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerTrustContact entity
 */
exports.getPetitionerTrustContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Name of Trustee is a required field.',
  },
  additionalValidation: {
    secondaryName: joi.string().required(),
  },
});
