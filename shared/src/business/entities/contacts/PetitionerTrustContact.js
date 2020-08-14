const joi = require('joi');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerTrustContact entity
 */
exports.getPetitionerTrustContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Enter name of trustee',
  },
  additionalValidation: {
    secondaryName: joi.string().max(500).required(),
  },
  contactName: 'PetitionerTrustContact',
});
