const joi = require('joi-browser');
const { createContactFactory } = require('./PetitionContact');

/**
 * returns the constructor used for creating the PetitionerCorporationContact entity
 */
exports.getPetitionerCorporationContact = createContactFactory({
  additionalErrorMappings: {
    inCareOf: 'In Care Of is a required field.',
  },
  additionalValidation: {
    inCareOf: joi.string().required(),
  },
});
