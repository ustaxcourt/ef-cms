const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the SurvivingSpouseContact entity
 */
exports.getSurvivingSpouseContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Name of Surviving Spouse is a required field.',
  },
  additionalValidation: {
    secondaryName: joi.string().required(),
  },
});
