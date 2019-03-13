const joi = require('joi-browser');

const { createContactFactory } = require('./PetitionContact');

/**
 * returns the constructor used for creating the PetitionerDeceasedSpouseContact entity
 */
exports.getPetitionerDeceasedSpouseContact = createContactFactory({
  additionalErrorMappings: {},
  additionalValidation: {
    phone: joi.optional().allow(null),
  },
});
