const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerPartnershipRepContact entity
 */
exports.getPetitionerPartnershipRepContact = ContactFactory.createContactFactory(
  {
    additionalErrorMappings: {},
    additionalValidation: {},
  },
);
