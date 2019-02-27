const joi = require('joi-browser');

const { createContactFactory } = require('./PetitionContact');

exports.getPetitionerConservatorContact = createContactFactory({
  additionalErrorMappings: { name: 'Name of Conservator is a required field.' },
  additionalValidation: {
    inCareOf: joi.string().required(),
  },
});
