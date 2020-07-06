const joi = require('@hapi/joi');
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
      secondaryName: joi.string().max(500).required(),
      title: joi.string().max(100).optional(),
    },
    contactName: 'PetitionerEstateWithExecutorPrimaryContact',
  },
);
