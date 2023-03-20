const { ContactFactory } = require('./ContactFactory');
const { JoiValidationConstants } = require('../JoiValidationConstants');
/**
 * returns the constructor used for creating the PetitionerGuardianContact entity
 */
exports.getPetitionerGuardianContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Enter name of guardian',
  },
  additionalValidation: {
    secondaryName: JoiValidationConstants.STRING.max(500).required(),
  },
  contactName: 'PetitionerGuardianContact',
});
