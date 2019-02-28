const { createContactFactory } = require('./PetitionContact');

/**
 * returns the constructor used for creating the PetitionerSpouseContact entity
 */
exports.getPetitionerSpouseContact = createContactFactory({
  additionalErrorMappings: {},
  additionalValidation: {},
});
