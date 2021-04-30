const { ContactFactory } = require('../entities/contacts/ContactFactory');

/**
 * validateSecondaryContactInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.contactInfo the contact data
 * @param {string} providers.partyType the party type for the case
 * @returns {object} errors (null if no errors)
 */
exports.validateSecondaryContactInteractor = ({
  applicationContext,
  contactInfo,
  partyType,
}) => {
  return ContactFactory.createContacts({
    applicationContext,
    contactInfo: { secondary: contactInfo },
    partyType,
  }).secondary.getFormattedValidationErrors();
};
