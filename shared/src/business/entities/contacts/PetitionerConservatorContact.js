const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerConservatorContact entity
 */
exports.getPetitionerConservatorContact = ContactFactory.createContactFactory({
  additionalErrorMappings: { name: 'Name of Conservator is a required field.' },
  additionalValidation: {
    inCareOf: joi.string().optional(),
  },
});
