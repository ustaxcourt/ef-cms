const joi = require('joi-browser');
const { createContactFactory } = require('./PetitionContact');

/**
 * returns the constructor used for creating the PetitionerEstateWithExecutorPrimaryContact entity
 */
exports.getPetitionerEstateWithExecutorPrimaryContact = createContactFactory({
  additionalErrorMappings: {
    title: 'Title is a required field.',
  },
  additionalValidation: {
    title: joi.string().optional(),
  },
});
