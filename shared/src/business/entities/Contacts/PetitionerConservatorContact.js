const joi = require('joi-browser');

const { createContactFactory } = require('./PetitionContact');

/**
 * returns the constructor used for creating the PetitionerConservatorContact entity
 */
exports.getPetitionerConservatorContact = createContactFactory({
  additionalErrorMappings: { name: 'Name of Conservator is a required field.' },
  additionalValidation: {
    inCareOf: joi.string().optional(),
  },
});
