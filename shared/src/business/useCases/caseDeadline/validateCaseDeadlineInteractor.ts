import { CaseDeadline, RawCaseDeadline } from '../../entities/CaseDeadline';

export const validateCaseDeadlineInteractor = (
  applicationContext, // eslint-disable-line @typescript-eslint/no-unused-vars
  { caseDeadline }: { caseDeadline: RawCaseDeadline },
): Record<string, string> | null => {
  const errors = new CaseDeadline(caseDeadline).getFormattedValidationErrors();

  return errors;
};
