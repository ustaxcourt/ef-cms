const joi = require('joi-browser');

const { createContactFactory } = require('./PetitionContact');

exports.getPetitionerIntermediaryContact = createContactFactory({
  additionalErrorMappings: {
    inCareOf: 'In Care Of has errors.',
  },
  additionalValidation: {
    inCareOf: joi.string().optional(),
  },
});
