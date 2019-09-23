const joi = require('joi-browser');
const { ContactFactory } = require('./ContactFactory');

/**
 * returns the constructor used for creating the PartnershipBBAPrimaryContact entity
 */
exports.getPartnershipBBAPrimaryContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    secondaryName: 'Enter partnership representative name',
  },
  additionalValidation: {
    secondaryName: joi.string().required(),
  },
});
