const { Case } = require('../entities/cases/Case');

/**
 * validateCaseDetailInteractor
 * @param caseDetail
 * @returns {Promise<{petitionFileId}>}
 */
exports.validateCaseDetailInteractor = ({ caseDetail }) => {
  return new Case(caseDetail).getFormattedValidationErrors();
};
