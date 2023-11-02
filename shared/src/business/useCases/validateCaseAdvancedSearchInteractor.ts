import { CaseSearch } from '../entities/cases/CaseSearch';
import { TValidationError } from '@shared/business/entities/joiValidationEntity/helper';

export const validateCaseAdvancedSearchInteractor = ({
  caseSearch,
}: {
  caseSearch: any;
}): TValidationError | null => {
  return new CaseSearch(caseSearch).getValidationErrors();
};
