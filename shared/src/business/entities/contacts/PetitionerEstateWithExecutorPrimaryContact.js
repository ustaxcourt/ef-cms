const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerEstateWithExecutorPrimaryContact entity
 */
exports.getPetitionerEstateWithExecutorPrimaryContact = ContactFactory.createContactFactory(
  {
    additionalErrorMappings: {
      title: 'Title is a required field.',
    },
    additionalValidation: {
      title: joi.string().optional(),
    },
  },
);
