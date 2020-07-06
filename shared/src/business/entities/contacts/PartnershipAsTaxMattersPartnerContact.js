const joi = require('@hapi/joi');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PartnershipAsTaxMattersPartnerPrimaryContact entity
 */
exports.getPartnershipAsTaxMattersPartnerPrimaryContact = ContactFactory.createContactFactory(
  {
    additionalErrorMappings: {
      secondaryName: 'Enter Tax Matters Partner name',
    },
    additionalValidation: {
      secondaryName: joi.string().max(500).required(),
    },
    contactName: 'PartnershipAsTaxMattersPartnerPrimaryContact',
  },
);
