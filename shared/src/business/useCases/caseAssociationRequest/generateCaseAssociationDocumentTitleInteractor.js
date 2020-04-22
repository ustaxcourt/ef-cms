const {
  CaseAssociationRequestFactory,
} = require('../../entities/CaseAssociationRequestFactory');

/**
 * generateCaseAssociationDocumentTitleInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseAssociationRequest the case association request data
 * @param {string} providers.contactPrimaryName the name of the primary contact
 * @param {string} providers.contactSecondaryName the name of the secondary contact
 * @returns {string} document title
 */
exports.generateCaseAssociationDocumentTitleInteractor = ({
  applicationContext,
  caseAssociationRequest,
  contactPrimaryName,
  contactSecondaryName,
}) => {
  const caseAssociation = CaseAssociationRequestFactory(
    caseAssociationRequest,
    { applicationContext },
  );
  return caseAssociation.getDocumentTitle(
    contactPrimaryName,
    contactSecondaryName,
  );
};
