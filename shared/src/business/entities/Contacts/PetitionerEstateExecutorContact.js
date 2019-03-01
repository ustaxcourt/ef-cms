const joi = require('joi-browser');

const { createContactFactory } = require('./PetitionContact');

/**
 * returns the constructor used for creating the PetitionerEstateExecutorContact entity
 */
exports.getPetitionerEstateExecutorContact = createContactFactory({
  additionalErrorMappings: {},
  additionalValidation: {
    phone: joi.optional().allow(null),
  },
});
