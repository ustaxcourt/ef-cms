import { CaseSearch } from '../entities/cases/CaseSearch';
import { applicationContext } from '../test/createTestApplicationContext';
import { validateCaseAdvancedSearchInteractor } from './validateCaseAdvancedSearchInteractor';

describe('validateCaseAdvancedSearchInteractor', () => {
  let validatorSpy;

  beforeEach(() => {
    validatorSpy = jest
      .spyOn(CaseSearch.prototype, 'getFormattedValidationErrors')
      .mockImplementation(() => []);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be able to set an item', async () => {
    await validateCaseAdvancedSearchInteractor(applicationContext, {
      caseSearch: {},
    });
    expect(validatorSpy.mock.calls.length).toEqual(1);
  });
});
