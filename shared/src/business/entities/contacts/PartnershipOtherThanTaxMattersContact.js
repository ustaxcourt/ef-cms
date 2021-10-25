const { ContactFactory } = require('./ContactFactory');
const { JoiValidationConstants } = require('../JoiValidationConstants');

/**
 * returns the constructor used for creating the PartnershipOtherThanTaxMattersPrimaryContact entity
 */
exports.getPartnershipOtherThanTaxMattersPrimaryContact =
  ContactFactory.createContactFactory({
    additionalErrorMappings: {
      secondaryName: 'Enter name of partner',
    },
    additionalValidation: {
      secondaryName: JoiValidationConstants.STRING.max(500).required(),
    },
    contactName: 'PartnershipOtherThanTaxMattersPrimaryContact',
  });
