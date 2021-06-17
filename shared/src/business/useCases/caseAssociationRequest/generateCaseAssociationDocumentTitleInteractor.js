const {
  CaseAssociationRequestFactory,
} = require('../../entities/CaseAssociationRequestFactory');

/**
 * generateCaseAssociationDocumentTitleInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseAssociationRequest the case association request data
 * @returns {string} document title
 */
exports.generateCaseAssociationDocumentTitleInteractor = (
  applicationContext,
  { caseAssociationRequest, petitioners },
) => {
  const caseAssociation = CaseAssociationRequestFactory(caseAssociationRequest);
  return caseAssociation.getDocumentTitle(petitioners);
};
