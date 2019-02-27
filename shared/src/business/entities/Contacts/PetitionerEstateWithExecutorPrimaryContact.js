const { createContactFactory } = require('./PetitionContact');

exports.getPetitionerEstateWithExecutorPrimaryContact = createContactFactory({
  additionalErrorMappings: {},
  additionalValidation: {},
});
