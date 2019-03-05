const joi = require('joi-browser');

const { createContactFactory } = require('./PetitionContact');

/**
 * returns the constructor used for creating the PetitionerIntermediaryContact entity
 */
exports.getPetitionerIntermediaryContact = createContactFactory({
  additionalErrorMappings: {
    inCareOf: 'In Care Of has errors.',
  },
  additionalValidation: {
    inCareOf: joi.string().optional(),
  },
});
