import { CaseDeadline, RawCaseDeadline } from '../../entities/CaseDeadline';

export const validateCaseDeadlineInteractor = (
  applicationContext,
  { caseDeadline }: { caseDeadline: RawCaseDeadline },
): Record<string, string> | null => {
  const errors = new CaseDeadline(caseDeadline, {
    applicationContext,
  }).getFormattedValidationErrors();

  return errors;
};
