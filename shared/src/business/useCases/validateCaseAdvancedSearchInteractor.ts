import { CaseSearch } from '../entities/cases/CaseSearch';

export const validateCaseAdvancedSearchInteractor = ({
  caseSearch,
}: {
  caseSearch: any;
}) => {
  return new CaseSearch(caseSearch).getFormattedValidationErrors();
};
