import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateCaseAdvancedSearchAction } from './validateCaseAdvancedSearchAction';

describe('validateCaseAdvancedSearchAction', () => {
  let validateCaseAdvancedSearchStub;
  let successStub;
  let errorStub;

  beforeEach(() => {
    validateCaseAdvancedSearchStub = jest.fn();
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateCaseAdvancedSearchInteractor: validateCaseAdvancedSearchStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('validates advanced case search successfully', async () => {
    validateCaseAdvancedSearchStub = jest.fn().mockReturnValue({});

    await runAction(validateCaseAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(validateCaseAdvancedSearchStub.mock.calls.length).toEqual(1);
    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('fails validation for advanced case search', async () => {
    validateCaseAdvancedSearchStub = jest.fn().mockReturnValue({ foo: 'bar' });

    await runAction(validateCaseAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(validateCaseAdvancedSearchStub.mock.calls.length).toEqual(1);
    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
