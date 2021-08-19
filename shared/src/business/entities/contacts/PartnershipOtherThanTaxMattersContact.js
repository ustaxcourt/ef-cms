const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const { ContactFactory } = require('./ContactFactory');

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
