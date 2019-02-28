const { createContactFactory } = require('./PetitionContact');

exports.getPetitionerTaxpayerContact = createContactFactory({
  additionalErrorMappings: {
    name: 'Name of Taxpayer is a required field.',
  },
  additionalValidation: {},
});
