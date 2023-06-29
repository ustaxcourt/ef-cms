import { CaseAssociationRequestFactory } from '../../entities/caseAssociation/CaseAssociationRequestFactory';

export const generateCaseAssociationDocumentTitleInteractor = ({
  caseAssociationRequest,
  petitioners,
}: {
  caseAssociationRequest: any;
  petitioners: any[];
}) => {
  const caseAssociationDocument = CaseAssociationRequestFactory(
    caseAssociationRequest,
  );

  return caseAssociationDocument.getDocumentTitle(petitioners);
};
