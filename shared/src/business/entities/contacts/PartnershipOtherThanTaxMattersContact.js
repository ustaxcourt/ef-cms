const joi = require('joi-browser');
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
      secondaryName: joi.string().required(),
    },
  },
);
