/**
 * validateCaseAssociationRequest
 * @param applicationContext
 * @param caseAssociationRequest
 * @returns {Object}
 */
exports.validateCaseAssociationRequest = ({
  caseAssociationRequest,
  applicationContext,
}) => {
  const errors = applicationContext
    .getEntityConstructors()
    .CaseAssociationRequest(caseAssociationRequest)
    .getFormattedValidationErrors();
  if (!errors) return null;

  return errors;
};
