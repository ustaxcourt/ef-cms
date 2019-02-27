const joi = require('joi-browser');

const { createContactFactory } = require('./PetitionContact');

exports.getPetitionerEstateExecutorContact = createContactFactory({
  additionalErrorMappings: {
    title: 'Title is a required field.',
  },
  additionalValidation: {
    title: joi.string().optional(),
  },
});
