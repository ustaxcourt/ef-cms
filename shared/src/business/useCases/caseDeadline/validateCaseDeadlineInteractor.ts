import { CaseDeadline, RawCaseDeadline } from '../../entities/CaseDeadline';

export const validateCaseDeadlineInteractor = (
  _applicationContext,
  { caseDeadline }: { caseDeadline: RawCaseDeadline },
): Record<string, string> | null => {
  const errors = new CaseDeadline(caseDeadline).getFormattedValidationErrors();

  return errors;
};
