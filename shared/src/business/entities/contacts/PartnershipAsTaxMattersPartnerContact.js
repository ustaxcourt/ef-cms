const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const { ContactFactory } = require('./ContactFactory');

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
