const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PetitionerCustodianContact entity
 */
exports.getPetitionerCustodianContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Name of Custodian is a required field.',
  },
  additionalValidation: {
    secondaryName: joi.string().required(),
  },
});
