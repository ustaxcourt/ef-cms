const joi = require('@hapi/joi');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PartnershipOtherThanTaxMattersPrimaryContact entity
 */
exports.getPartnershipOtherThanTaxMattersPrimaryContact = ContactFactory.createContactFactory(
  {
    additionalErrorMappings: {
      secondaryName: 'Enter name of partner',
    },
    additionalValidation: {
      secondaryName: joi.string().max(500).required(),
    },
    contactName: 'PartnershipOtherThanTaxMattersPrimaryContact',
  },
);
