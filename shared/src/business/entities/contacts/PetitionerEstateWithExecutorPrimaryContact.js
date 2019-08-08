const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerEstateWithExecutorPrimaryContact entity
 */
exports.getPetitionerEstateWithExecutorPrimaryContact = ContactFactory.createContactFactory(
  {
    additionalErrorMappings: {
      secondaryName:
        'Name of Executor/Personal Representative is a required field.',
      title: 'Title is a required field.',
    },
    additionalValidation: {
      secondaryName: joi.string().required(),
      title: joi.string().optional(),
    },
  },
);
