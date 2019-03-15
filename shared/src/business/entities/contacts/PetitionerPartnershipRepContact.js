const { createContactFactory } = require('./PetitionContact');

/**
 * returns the constructor used for creating the PetitionerPartnershipRepContact entity
 */
exports.getPetitionerPartnershipRepContact = createContactFactory({
  additionalErrorMappings: {},
  additionalValidation: {},
});
