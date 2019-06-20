/**
 * validateCaseAssociationRequest
 * @param applicationContext
 * @param caseAssociationRequest
 * @returns {object}
 */
exports.validateCaseAssociationRequest = ({
  caseAssociationRequest,
  applicationContext,
}) => {
  const errors = applicationContext
    .getEntityConstructors()
    .CaseAssociationRequestFactory(caseAssociationRequest)
    .getFormattedValidationErrors();
  if (!errors) return null;

  return errors;
};
