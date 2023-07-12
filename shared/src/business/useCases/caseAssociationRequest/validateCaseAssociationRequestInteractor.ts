import { CaseAssociationRequestFactory } from '../../entities/caseAssociation/CaseAssociationRequestFactory';

export const validateCaseAssociationRequestInteractor = ({
  caseAssociationRequest,
}) => {
  const errors = CaseAssociationRequestFactory(
    caseAssociationRequest,
  ).getFormattedValidationErrors();

  return errors || null;
};
