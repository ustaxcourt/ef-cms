import { CaseSearch } from '../entities/cases/CaseSearch';
import { validateCaseAdvancedSearchInteractor } from './validateCaseAdvancedSearchInteractor';

describe('validateCaseAdvancedSearchInteractor', () => {
  const mockValidationErrors = {
    petitionerName: 'Enter a name',
  };
  let validatorSpy = jest
    .spyOn(CaseSearch.prototype, 'getValidationErrors')
    .mockReturnValue(mockValidationErrors);

  it('should return the results of validating the case search parameters', () => {
    const result = validateCaseAdvancedSearchInteractor({
      caseSearch: {},
    });

    expect(validatorSpy.mock.calls.length).toEqual(1);
    expect(result).toEqual(mockValidationErrors);
  });
});
