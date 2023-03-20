const { ContactFactory } = require('./ContactFactory');
const { JoiValidationConstants } = require('../JoiValidationConstants');

/**
 * returns the constructor used for creating the PetitionerIntermediaryContact entity
 */
exports.getPetitionerIntermediaryContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    inCareOf: 'In care of has errors.',
  },
  additionalValidation: {
    inCareOf: JoiValidationConstants.STRING.max(100).optional(),
  },
  contactName: 'PetitionerIntermediaryContact',
});
