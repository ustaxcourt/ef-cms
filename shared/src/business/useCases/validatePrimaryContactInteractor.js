const { ContactFactory } = require('../entities/cases/ContactFactory');

/**
 * validatePrimaryContactInteractor
 * @param caseDetail
 * @returns {*}
 */
exports.validatePrimaryContactInteractor = ({ contactInfo }) => {
  return new ContactFactory(contactInfo).getFormattedValidationErrors();
};
