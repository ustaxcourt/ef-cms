const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerConservatorContact entity
 */
exports.getPetitionerConservatorContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Name of Conservator is a required field.',
  },
  additionalValidation: {
    secondaryName: joi.string().required(),
  },
});
