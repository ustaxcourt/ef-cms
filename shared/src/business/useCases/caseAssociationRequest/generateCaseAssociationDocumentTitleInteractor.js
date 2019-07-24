/**
 * generateCaseAssociationDocumentTitleInteractor
 *
 * @param applicationContext
 * @param caseAssociationRequest
 * @param contactPrimaryName
 * @param contactSecondaryName
 * @returns {string} document title
 */
exports.generateCaseAssociationDocumentTitleInteractor = ({
  applicationContext,
  caseAssociationRequest,
  contactPrimaryName,
  contactSecondaryName,
}) => {
  const caseAssociation = applicationContext
    .getEntityConstructors()
    .CaseAssociationRequestFactory(caseAssociationRequest);
  return caseAssociation.getDocumentTitle(
    contactPrimaryName,
    contactSecondaryName,
  );
};
