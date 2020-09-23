const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerCustodianContact entity
 */
exports.getPetitionerCustodianContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Enter name of custodian',
  },
  additionalValidation: {
    secondaryName: JoiValidationConstants.STRING.max(500).required(),
  },
  contactName: 'PetitionerCustodianContact',
});
