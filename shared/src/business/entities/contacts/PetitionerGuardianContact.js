const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');
/**
 * returns the constructor used for creating the PetitionerGuardianContact entity
 */
exports.getPetitionerGuardianContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Name of Guardian is a required field.',
  },
  additionalValidation: {
    secondaryName: joi.string().required(),
  },
});
