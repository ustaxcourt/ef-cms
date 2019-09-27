const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the SurvivingSpouseContact entity
 */
exports.getSurvivingSpouseContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Enter name of surviving spouse',
  },
  additionalValidation: {
    secondaryName: joi.string().required(),
  },
});
