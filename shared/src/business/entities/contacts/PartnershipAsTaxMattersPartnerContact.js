const { ContactFactory } = require('./ContactFactory');
const { JoiValidationConstants } = require('../JoiValidationConstants');

/**
 * returns the constructor used for creating the PartnershipAsTaxMattersPartnerPrimaryContact entity
 */
exports.getPartnershipAsTaxMattersPartnerPrimaryContact =
  ContactFactory.createContactFactory({
    additionalErrorMappings: {
      secondaryName: 'Enter Tax Matters Partner name',
    },
    additionalValidation: {
      secondaryName: JoiValidationConstants.STRING.max(500).required(),
    },
    contactName: 'PartnershipAsTaxMattersPartnerPrimaryContact',
  });
