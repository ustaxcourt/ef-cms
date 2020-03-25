import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateCaseAdvancedSearchAction } from './validateCaseAdvancedSearchAction';

const applicationContext = applicationContextForClient;
presenter.providers.applicationContext = applicationContextForClient;

describe('validateCaseAdvancedSearchAction', () => {
  let successStub;
  let errorStub;

  beforeEach(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('validates advanced case search successfully', async () => {
    applicationContext.getUseCases().validateCaseAdvancedSearchInteractor = jest
      .fn()
      .mockReturnValue({});

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
    applicationContext.getUseCases().validateCaseAdvancedSearchInteractor = jest
      .fn()
      .mockReturnValue({ foo: 'bar' });

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
