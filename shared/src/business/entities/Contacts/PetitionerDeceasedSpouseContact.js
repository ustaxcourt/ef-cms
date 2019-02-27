const joi = require('joi-browser');

const { createContactFactory } = require('./PetitionContact');

exports.getPetitionerDeceasedSpouseContact = createContactFactory({
  additionalErrorMappings: {},
  additionalValidation: {
    phone: joi.optional().allow(null),
  },
});
