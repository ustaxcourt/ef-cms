import { Case } from '../entities/cases/Case';
import { CaseQC } from '../entities/cases/CaseQC';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

/**
 * validateCaseDetailInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseDetail the case data to validate
 * @param {object} providers.useCaseEntity the flag indicating what kind of entity to use
 * @returns {object} errors (null if no errors)
 */
export const validateCaseDetailInteractor = (
  {
    caseDetail,
    useCaseEntity = false,
  }: { caseDetail: any; useCaseEntity?: boolean },
  authorizedUser: UnknownAuthUser,
): Record<string, any> | null => {
  if (useCaseEntity) {
    return new Case(caseDetail, {
      authorizedUser,
    }).getFormattedValidationErrors();
  }
  return new CaseQC(caseDetail, {
    authorizedUser,
  }).getFormattedValidationErrors();
};
