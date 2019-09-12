const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerDeceasedSpouseContact entity
 */
exports.getPetitionerDeceasedSpouseContact = ContactFactory.createContactFactory(
  {
    additionalErrorMappings: {
      inCareOf: 'Enter in care of',
    },
    additionalValidation: {
      inCareOf: joi.string().required(),
      phone: joi.optional().allow(null),
    },
  },
);
