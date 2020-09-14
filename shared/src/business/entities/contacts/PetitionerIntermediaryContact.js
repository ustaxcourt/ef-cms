const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const { ContactFactory } = require('./ContactFactory');

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
