import { CaseAssociationRequestFactory } from '../../entities/CaseAssociationRequestFactory';

/**
 * validateCaseAssociationRequestInteractor
 *
 * @param {object} providers the providers object
 * @param {string} providers.caseAssociationRequest the case association request data
 * @returns {object} errors if there are any, or null
 */
export const validateCaseAssociationRequestInteractor = ({
  caseAssociationRequest,
}) => {
  const errors = CaseAssociationRequestFactory(
    caseAssociationRequest,
  ).getFormattedValidationErrors();

  return errors || null;
};
