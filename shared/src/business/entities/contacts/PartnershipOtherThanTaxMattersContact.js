const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PartnershipOtherThanTaxMattersPrimaryContact entity
 */
exports.getPartnershipOtherThanTaxMattersPrimaryContact = ContactFactory.createContactFactory(
  {
    additionalErrorMappings: {
      secondaryName: 'Name of Partner is a required field.',
    },
    additionalValidation: {
      secondaryName: joi.string().required(),
    },
  },
);
