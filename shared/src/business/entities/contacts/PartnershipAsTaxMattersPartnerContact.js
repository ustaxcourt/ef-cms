const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PartnershipAsTaxMattersPartnerPrimaryContact entity
 */
exports.getPartnershipAsTaxMattersPartnerPrimaryContact = ContactFactory.createContactFactory(
  {
    additionalErrorMappings: {
      secondaryName: 'Tax Matters Partner Name is a required field.',
    },
    additionalValidation: {
      secondaryName: joi.string().required(),
    },
  },
);
