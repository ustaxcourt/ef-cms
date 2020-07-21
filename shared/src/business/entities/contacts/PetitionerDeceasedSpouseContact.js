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
      inCareOf: joi.string().max(100).required(),
      phone: joi.string().max(100).optional().allow(null),
    },
    contactName: 'PetitionerDeceasedSpouseContact',
  },
);
