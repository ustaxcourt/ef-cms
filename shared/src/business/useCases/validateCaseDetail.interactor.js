const Case = require('../entities/Case');

/**
 * validateCaseDetail
 * @param applicationContext
 * @param caseInitiator
 * @param user
 * @param fileHasUploaded
 * @returns {Promise<{petitionFileId}>}
 */
exports.validateCaseDetail = ({ caseDetail }) => {
  const errors = new Case(caseDetail).getFormattedValidationErrors();
  if (!errors) return null;
  return errors;
};
