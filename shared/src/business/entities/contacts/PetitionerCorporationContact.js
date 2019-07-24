const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerCorporationContact entity
 */
exports.getPetitionerCorporationContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    inCareOf: 'In Care Of is a required field.',
  },
  additionalValidation: {
    inCareOf: joi.string().required(),
  },
});
