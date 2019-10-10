const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerCustodianContact entity
 */
exports.getPetitionerCustodianContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Enter name of custodian',
  },
  additionalValidation: {
    secondaryName: joi.string().required(),
  },
});
