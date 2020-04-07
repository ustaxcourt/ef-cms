const joi = require('@hapi/joi');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerDeceasedSpouseContact entity
 */
exports.getPetitionerDeceasedSpouseContact = ContactFactory.createContactFactory(
  {
    additionalErrorMappings: {
      inCareOf: 'Enter name for in care of',
    },
    additionalValidation: {
      inCareOf: joi.string().required(),
      phone: joi.string().optional().allow(null),
    },
  },
);
