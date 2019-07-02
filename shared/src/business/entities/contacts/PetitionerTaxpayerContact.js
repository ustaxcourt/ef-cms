const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerTaxpayerContact entity
 */
exports.getPetitionerTaxpayerContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    name: 'Name of Taxpayer is a required field.',
  },
  additionalValidation: {},
});
