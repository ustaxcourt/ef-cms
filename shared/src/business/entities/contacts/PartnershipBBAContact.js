const { ContactFactory } = require('./ContactFactory');
const { JoiValidationConstants } = require('../JoiValidationConstants');

/**
 * returns the constructor used for creating the PartnershipBBAPrimaryContact entity
 */
exports.getPartnershipBBAPrimaryContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Enter partnership representative name',
  },
  additionalValidation: {
    secondaryName: JoiValidationConstants.STRING.max(500).required(),
  },
  contactName: 'PartnershipBBAPrimaryContact',
});
