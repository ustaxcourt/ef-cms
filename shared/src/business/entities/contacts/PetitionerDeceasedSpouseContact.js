const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerDeceasedSpouseContact entity
 */
exports.getPetitionerDeceasedSpouseContact =
  ContactFactory.createContactFactory({
    additionalErrorMappings: {
      inCareOf: 'Enter name for in care of',
    },
    additionalValidation: {
      inCareOf: JoiValidationConstants.STRING.max(100).required(),
      phone: JoiValidationConstants.STRING.max(100).optional().allow(null),
    },
    contactName: 'PetitionerDeceasedSpouseContact',
  });
