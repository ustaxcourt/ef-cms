const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerEstateWithExecutorPrimaryContact entity
 */
exports.getPetitionerEstateWithExecutorPrimaryContact =
  ContactFactory.createContactFactory({
    additionalErrorMappings: {
      secondaryName: 'Enter name of executor/personal representative',
      title: 'Enter title',
    },
    additionalValidation: {
      secondaryName: JoiValidationConstants.STRING.max(500).required(),
      title: JoiValidationConstants.STRING.max(100).optional(),
    },
    contactName: 'PetitionerEstateWithExecutorPrimaryContact',
  });
