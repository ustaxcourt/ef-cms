const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerEstateWithExecutorPrimaryContact entity
 */
exports.getPetitionerEstateWithExecutorPrimaryContact = ContactFactory.createContactFactory(
  {
    additionalErrorMappings: {
      secondaryName: 'Enter name of executor/personal representative',
      title: 'Enter title',
    },
    additionalValidation: {
      secondaryName: joi.string().required(),
      title: joi.string().optional(),
    },
  },
);
