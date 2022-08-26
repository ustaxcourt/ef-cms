import { CaseDeadline } from '../../entities/CaseDeadline';

/**
 * validateCaseDeadlineInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseDeadline the case deadline data
 * @returns {object} errors if there are any, otherwise null
 */
export const validateCaseDeadlineInteractor = (
  applicationContext,
  { caseDeadline }: { caseDeadline: TCaseDeadline },
) => {
  const errors = new CaseDeadline(caseDeadline, {
    applicationContext,
  }).getFormattedValidationErrors();
  return errors || null;
};
