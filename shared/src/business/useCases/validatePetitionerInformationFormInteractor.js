const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { isEmpty } = require('lodash');

/**
 * validatePetitionerInformationFormInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseDetail the case detail to validate
 * @returns {object} errors (null if no errors)
 */
exports.validatePetitionerInformationFormInteractor = ({
  applicationContext,
  contactPrimary,
  contactSecondary,
  partyType,
}) => {
  const contacts = ContactFactory.createContacts({
    applicationContext,
    contactInfo: { primary: contactPrimary, secondary: contactSecondary },
    partyType,
  });

  return {
    contactPrimary: contacts.primary.getFormattedValidationErrors(),
    contactSecondary: isEmpty(contacts.secondary)
      ? {}
      : contacts.secondary.getFormattedValidationErrors(),
  };
};
