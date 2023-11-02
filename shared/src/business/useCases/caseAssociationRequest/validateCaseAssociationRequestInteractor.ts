import { CaseAssociationRequestFactory } from '../../entities/caseAssociation/CaseAssociationRequestFactory';

export const validateCaseAssociationRequestInteractor = ({
  caseAssociationRequest,
}) => {
  const errors = CaseAssociationRequestFactory(
    caseAssociationRequest,
  ).getValidationErrors();

  return errors || null;
};
