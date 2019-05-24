const { Case } = require('../entities/Case');

/**
 * validateCaseDetail
 * @param caseDetail
 * @returns {Promise<{petitionFileId}>}
 */
exports.validateCaseDetail = ({ caseDetail }) => {
  return new Case(caseDetail).getFormattedValidationErrors();
};
