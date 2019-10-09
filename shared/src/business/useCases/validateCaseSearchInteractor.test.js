const {
  validateCaseSearchInteractor,
} = require('./validateCaseSearchInteractor');

const { CaseSearch } = require('../entities/cases/CaseSearch');

describe('validateCaseSearchInteractor', () => {
  const applicationContext = {};
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
    await validateCaseSearchInteractor({
      applicationContext,
      caseSearch: {},
    });
    expect(validatorSpy.mock.calls.length).toEqual(1);
  });
});
