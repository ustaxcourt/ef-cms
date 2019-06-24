/**
 * validateCaseAssociationRequest
 * @param applicationContext
 * @param caseAssociationRequest
 * @returns {object}
 */
exports.validateCaseAssociationRequest = ({
  applicationContext,
  caseAssociationRequest,
}) => {
  const errors = applicationContext
    .getEntityConstructors()
    .CaseAssociationRequestFactory(caseAssociationRequest)
    .getFormattedValidationErrors();
  if (!errors) return null;

  return errors;
};
