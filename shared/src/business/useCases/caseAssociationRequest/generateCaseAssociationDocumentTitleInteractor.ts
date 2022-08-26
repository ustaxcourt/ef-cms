import { CaseAssociationRequestFactory } from '../../entities/CaseAssociationRequestFactory';

/**
 * generateCaseAssociationDocumentTitleInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseAssociationRequest the case association request data
 * @returns {string} document title
 */
export const generateCaseAssociationDocumentTitleInteractor = (
  applicationContext: IApplicationContext,
  {
    caseAssociationRequest,
    petitioners,
  }: { caseAssociationRequest: any; petitioners: any[] },
) => {
  const caseAssociation = CaseAssociationRequestFactory(caseAssociationRequest);
  return caseAssociation.getDocumentTitle(petitioners);
};
