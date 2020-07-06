const joi = require('@hapi/joi');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the SurvivingSpouseContact entity
 */
exports.getSurvivingSpouseContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Enter name of surviving spouse',
  },
  additionalValidation: {
    secondaryName: joi.string().max(500).required(),
  },
  contactName: 'SurvivingSpouseContact',
});
