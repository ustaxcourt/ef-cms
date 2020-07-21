const joi = require('@hapi/joi');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerIntermediaryContact entity
 */
exports.getPetitionerIntermediaryContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    inCareOf: 'In care of has errors.',
  },
  additionalValidation: {
    inCareOf: joi.string().max(100).optional(),
  },
  contactName: 'PetitionerIntermediaryContact',
});
