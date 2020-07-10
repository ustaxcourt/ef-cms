const joi = require('@hapi/joi');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the OtherPetitionerContact entity
 */
exports.getOtherPetitionerContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    additionalName: 'Enter name of other petitioner',
  },
  additionalValidation: {
    additionalName: joi.string().max(500).required(),
  },
});
