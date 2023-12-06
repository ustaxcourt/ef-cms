import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateOpinionAdvancedSearchAction } from './validateOpinionAdvancedSearchAction';

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

    presenter.providers.applicationContext = applicationContext;
  });

  it('validates advanced opinion search successfully', async () => {
    applicationContext
      .getUseCases()
      .validateOpinionAdvancedSearchInteractor.mockReturnValue({});

    await runAction(validateOpinionAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          opinionSearch: {
            opinionTypes: {},
          },
        },
        form: {},
      },
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
      state: {
        advancedSearchForm: {
          opinionSearch: {
            opinionTypes: {},
          },
        },
        form: {},
      },
    });

    expect(
      applicationContext.getUseCases().validateOpinionAdvancedSearchInteractor
        .mock.calls.length,
    ).toEqual(1);
    expect(errorStub.mock.calls.length).toEqual(1);
  });

  it('should filter out opinion types that are not selected for search', async () => {
    applicationContext
      .getUseCases()
      .validateOpinionAdvancedSearchInteractor.mockReturnValue({ foo: 'bar' });

    await runAction(validateOpinionAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          opinionSearch: {
            opinionTypes: {
              Avocado: false,
              Banana: false,
              Cucumber: true,
              Mango: true,
            },
          },
        },
        form: {},
      },
    });

    expect(
      applicationContext.getUseCases().validateOpinionAdvancedSearchInteractor
        .mock.calls[0][0].opinionSearch,
    ).toMatchObject({ opinionTypes: ['Cucumber', 'Mango'] });
  });
});
