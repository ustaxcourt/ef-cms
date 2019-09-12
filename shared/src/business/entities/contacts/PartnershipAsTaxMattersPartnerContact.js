const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PartnershipAsTaxMattersPartnerPrimaryContact entity
 */
exports.getPartnershipAsTaxMattersPartnerPrimaryContact = ContactFactory.createContactFactory(
  {
    additionalErrorMappings: {
      secondaryName: 'Enter tax matters partner name.',
    },
    additionalValidation: {
      secondaryName: joi.string().required(),
    },
  },
);
