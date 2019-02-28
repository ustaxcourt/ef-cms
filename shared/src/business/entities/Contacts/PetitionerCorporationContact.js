const joi = require('joi-browser');

const { createContactFactory } = require('./PetitionContact');

exports.getPetitionerCorporationContact = createContactFactory({
  additionalErrorMappings: {
    inCareOf: 'In Care Of is a required field.',
  },
  additionalValidation: {
    inCareOf: joi.string().required(),
  },
});
