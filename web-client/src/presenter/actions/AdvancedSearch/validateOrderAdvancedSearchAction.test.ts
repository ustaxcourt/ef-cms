import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateOrderAdvancedSearchAction } from './validateOrderAdvancedSearchAction';

presenter.providers.applicationContext = applicationContext;

describe('validateOrderAdvancedSearchAction', () => {
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

  it('validates advanced order search successfully', async () => {
    applicationContext
      .getUseCases()
      .validateOrderAdvancedSearchInteractor.mockReturnValue({});

    await runAction(validateOrderAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(
      applicationContext.getUseCases().validateOrderAdvancedSearchInteractor
        .mock.calls.length,
    ).toEqual(1);
    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('fails validation for advanced order search', async () => {
    applicationContext
      .getUseCases()
      .validateOrderAdvancedSearchInteractor.mockReturnValue({ foo: 'bar' });

    await runAction(validateOrderAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(
      applicationContext.getUseCases().validateOrderAdvancedSearchInteractor
        .mock.calls.length,
    ).toEqual(1);
    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
