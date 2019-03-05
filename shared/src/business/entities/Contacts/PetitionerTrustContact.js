const joi = require('joi-browser');

const { createContactFactory } = require('./PetitionContact');

/**
 * returns the constructor used for creating the PetitionerTrustContact entity
 */
exports.getPetitionerTrustContact = createContactFactory({
  additionalErrorMappings: {
    inCareOf: 'In Care Of is a required field.',
  },
  additionalValidation: {
    inCareOf: joi.string().required(),
  },
});
