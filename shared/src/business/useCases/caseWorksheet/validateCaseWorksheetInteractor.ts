import { CaseWorksheet } from '../../entities/caseWorksheet/CaseWorksheet';

export const validateCaseWorksheetInteractor = ({ caseWorksheet }) => {
  const errors = new CaseWorksheet(
    caseWorksheet,
  ).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};
