const joi = require('@hapi/joi');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerCorporationContact entity
 */
exports.getPetitionerCorporationContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    inCareOf: 'Enter name for in care of',
  },
  additionalValidation: {
    inCareOf: joi.string().max(100).required(),
  },
  contactName: 'PetitionerCorporationContact',
});
