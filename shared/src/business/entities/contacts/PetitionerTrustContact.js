const { ContactFactory } = require('./ContactFactory');
const { JoiValidationConstants } = require('../JoiValidationConstants');

/**
 * returns the constructor used for creating the PetitionerTrustContact entity
 */
exports.getPetitionerTrustContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Enter name of trustee',
  },
  additionalValidation: {
    secondaryName: JoiValidationConstants.STRING.max(500).required(),
  },
  contactName: 'PetitionerTrustContact',
});
