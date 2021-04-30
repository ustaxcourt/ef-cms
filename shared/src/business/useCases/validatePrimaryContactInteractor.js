const { ContactFactory } = require('../entities/contacts/ContactFactory');

/**
 * validatePrimaryContactInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.contactInfo the contact data
 * @param {string} providers.partyType the party type for the case
 * @returns {object} errors (null if no errors)
 */
exports.validatePrimaryContactInteractor = ({
  applicationContext,
  contactInfo,
  partyType,
}) => {
  return ContactFactory.createContacts({
    applicationContext,
    contactInfo: { primary: contactInfo },
    partyType,
  }).primary.getFormattedValidationErrors();
};
