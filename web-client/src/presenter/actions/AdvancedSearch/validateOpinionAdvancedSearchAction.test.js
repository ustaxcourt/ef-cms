import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateOpinionAdvancedSearchAction } from './validateOpinionAdvancedSearchAction';

presenter.providers.applicationContext = applicationContext;

describe('validateOpinionAdvancedSearchAction', () => {
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

  it('validates advanced opinion search successfully', async () => {
    applicationContext
      .getUseCases()
      .validateOpinionAdvancedSearchInteractor.mockReturnValue({});

    await runAction(validateOpinionAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(
      applicationContext.getUseCases().validateOpinionAdvancedSearchInteractor
        .mock.calls.length,
    ).toEqual(1);
    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('fails validation for advanced opinion search', async () => {
    applicationContext
      .getUseCases()
      .validateOpinionAdvancedSearchInteractor.mockReturnValue({ foo: 'bar' });

    await runAction(validateOpinionAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(
      applicationContext.getUseCases().validateOpinionAdvancedSearchInteractor
        .mock.calls.length,
    ).toEqual(1);
    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
