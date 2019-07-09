const { ContactFactory } = require('../entities/contacts/ContactFactory');

/**
 * validatePrimaryContactInteractor
 * @param caseDetail
 * @returns {*}
 */
exports.validatePrimaryContactInteractor = ({ contactInfo, partyType }) => {
  return ContactFactory.createContacts({
    contactInfo: { primary: contactInfo },
    partyType,
  }).primary.getFormattedValidationErrors();
};
