import { CaseSearch } from '../entities/cases/CaseSearch';

export const validateCaseAdvancedSearchInteractor = ({
  caseSearch,
}: {
  caseSearch: any;
}) => {
  const search = new CaseSearch(caseSearch);
  return search.getFormattedValidationErrors();
};
