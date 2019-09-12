const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerCorporationContact entity
 */
exports.getPetitionerCorporationContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    inCareOf: 'Enter in care of',
  },
  additionalValidation: {
    inCareOf: joi.string().required(),
  },
});
