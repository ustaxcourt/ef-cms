import { CaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';

export const validateCaseWorksheetInteractor = ({
  caseWorksheet,
}: {
  caseWorksheet: RawCaseWorksheet;
}): Record<string, string> | null => {
  const errors = new CaseWorksheet(
    caseWorksheet,
  ).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};
