const joi = require('joi-browser');

const { createContactFactory } = require('./PetitionContact');

exports.getPetitionerEstateExecutorContact = createContactFactory({
  additionalErrorMappings: {},
  additionalValidation: {
    phone: joi.optional().allow(null),
  },
});
