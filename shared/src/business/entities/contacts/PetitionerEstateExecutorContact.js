const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerEstateExecutorContact entity
 */
exports.getPetitionerEstateExecutorContact = ContactFactory.createContactFactory(
  {
    additionalErrorMappings: {},
    additionalValidation: {
      phone: joi.optional().allow(null),
    },
  },
);
