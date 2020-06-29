const joi = require('@hapi/joi');
const { ContactFactory } = require('./ContactFactory');
const { OTHER_FILER_TYPES } = require('../EntityConstants');

/**
 * returns the constructor used for creating the OtherFilerContact entity
 */
exports.getOtherFilerContact = ContactFactory.createContactFactory({
  additionalErrorMappings: {
    otherFilerType: 'Select a filer type',
  },
  additionalValidation: {
    otherFilerType: joi
      .string()
      .valid(...OTHER_FILER_TYPES)
      .required(),
  },
});
