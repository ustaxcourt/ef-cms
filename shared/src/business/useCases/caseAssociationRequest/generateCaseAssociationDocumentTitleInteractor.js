/**
 * generateDocumentTitle
 *
 * @param applicationContext
 * @param documentMetadata
 * @returns {string} document title
 */
exports.generateCaseAssociationDocumentTitle = ({
  applicationContext,
  caseAssociationRequest,
  contactPrimaryName,
  contactSecondaryName,
}) => {
  const caseAssociation = applicationContext
    .getEntityConstructors()
    .CaseAssociationRequest(caseAssociationRequest);
  return caseAssociation.getDocumentTitle(
    contactPrimaryName,
    contactSecondaryName,
  );
};
