const { createContactFactory } = require('./PetitionContact');

exports.getPetitionerSpouseContact = createContactFactory({
  additionalErrorMappings: {},
  additionalValidation: {},
});
