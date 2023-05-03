import { Case } from '../entities/cases/Case';
import { CaseQC } from '../entities/cases/CaseQC';

/**
 * validateCaseDetailInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseDetail the case data to validate
 * @param {object} providers.useCaseEntity the flag indicating what kind of entity to use
 * @returns {object} errors (null if no errors)
 */
export const validateCaseDetailInteractor = (
  applicationContext: IApplicationContext,
  {
    caseDetail,
    useCaseEntity = false,
  }: { caseDetail: any; useCaseEntity?: boolean },
): Promise<Case> => {
  if (useCaseEntity) {
    return new Case(caseDetail, {
      applicationContext,
    }).getFormattedValidationErrors();
  }
  return new CaseQC(caseDetail, {
    applicationContext,
  }).getFormattedValidationErrors();
};
