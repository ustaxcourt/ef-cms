const { createContactFactory } = require('./PetitionContact');

exports.getPetitionerPrimaryContact = createContactFactory({
  additionalErrorMappings: {},
  additionalValidation: {},
});
