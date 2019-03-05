const { createContactFactory } = require('./PetitionContact');

/**
 * returns the constructor used for creating the PetitionerPrimaryContact entity
 */
exports.getPetitionerPrimaryContact = createContactFactory({
  additionalErrorMappings: {},
  additionalValidation: {},
});
