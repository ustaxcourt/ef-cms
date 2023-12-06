import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateCaseAdvancedSearchAction } from './validateCaseAdvancedSearchAction';

presenter.providers.applicationContext = applicationContext;

describe('validateCaseAdvancedSearchAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('validates advanced case search successfully', async () => {
    applicationContext
      .getUseCases()
      .validateCaseAdvancedSearchInteractor.mockReturnValue({});

    await runAction(validateCaseAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(
      applicationContext.getUseCases().validateCaseAdvancedSearchInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('fails validation for advanced case search', async () => {
    applicationContext
      .getUseCases()
      .validateCaseAdvancedSearchInteractor.mockReturnValue({ foo: 'bar' });

    await runAction(validateCaseAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(
      applicationContext.getUseCases().validateCaseAdvancedSearchInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
