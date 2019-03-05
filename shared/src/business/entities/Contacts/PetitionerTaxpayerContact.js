const { createContactFactory } = require('./PetitionContact');

/**
 * returns the constructor used for creating the PetitionerTaxpayerContact entity
 */
exports.getPetitionerTaxpayerContact = createContactFactory({
  additionalErrorMappings: {
    name: 'Name of Taxpayer is a required field.',
  },
  additionalValidation: {},
});
