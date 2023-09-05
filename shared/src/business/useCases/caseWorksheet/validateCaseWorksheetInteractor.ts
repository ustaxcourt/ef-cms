import { CaseWorksheet } from '../../entities/caseWorksheet/CaseWorksheet';

export const validateCaseWorksheetInteractor = ({
  caseWorksheet,
}): Record<string, string> | null => {
  const errors = new CaseWorksheet(
    caseWorksheet,
  ).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};
