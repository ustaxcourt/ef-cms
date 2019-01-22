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
  caseDetail.yearAmounts = ((caseDetail || {}).yearAmounts || []).map(
    yearAmount => {
      let yearToDate;
      try {
        yearToDate = new Date(`${yearAmount.year}-01-01`).toISOString();
      } catch (err) {
        yearToDate = null;
      }
      return {
        ...yearAmount,
        year: yearAmount.year ? yearToDate : null,
      };
    },
  );
  const errors = new Case(caseDetail).getFormattedValidationErrors();
  if (!errors) return null;
  return errors;
};
