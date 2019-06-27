const { Case } = require('../entities/cases/Case');

/**
 * validateCaseDetail
 * @param caseDetail
 * @returns {Promise<{petitionFileId}>}
 */
exports.validateCaseDetail = ({ caseDetail }) => {
  return new Case(caseDetail).getFormattedValidationErrors();
};
