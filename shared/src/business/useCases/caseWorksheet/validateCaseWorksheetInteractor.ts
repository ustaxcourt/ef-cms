import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '../../entities/caseWorksheet/CaseWorksheet';

export const validateCaseWorksheetInteractor = ({
  caseWorksheet,
}: {
  caseWorksheet: RawCaseWorksheet;
}) => {
  const errors = new CaseWorksheet(
    caseWorksheet,
  ).getFormattedValidationErrors();

  if (!errors) return null;

  return errors;
};
