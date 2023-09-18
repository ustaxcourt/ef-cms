import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitOpinionAdvancedSearchAction } from './submitOpinionAdvancedSearchAction';

describe('submitOpinionAdvancedSearchAction', () => {
  presenter.providers.applicationContext = applicationContext;

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .opinionAdvancedSearchInteractor.mockReturnValue(true);
  });

  it('should call opinionAdvancedSearchInteractor with the state.advancedSearchForm as searchParams', async () => {
    await runAction(submitOpinionAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          opinionSearch: {
            keyword: 'a',
            opinionTypes: {},
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().opinionAdvancedSearchInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().opinionAdvancedSearchInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      searchParams: {
        keyword: 'a',
      },
    });
  });

  it('should remove the docketNumberSuffix when a docket number is present', async () => {
    await runAction(submitOpinionAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          opinionSearch: {
            docketNumber: '105-20L',
            keyword: 'a',
            opinionTypes: {},
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().opinionAdvancedSearchInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().opinionAdvancedSearchInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      searchParams: {
        docketNumber: '105-20',
        keyword: 'a',
      },
    });
  });

  it('should set the error alert if 429 statusCode is returned', async () => {
    applicationContext
      .getUseCases()
      .opinionAdvancedSearchInteractor.mockImplementation(() => {
        const e = new Error();
        e.originalError = {
          response: {
            data: {
              type: 'ip-limiter',
            },
          },
        };
        e.responseCode = 429;
        throw e;
      });

    const { state } = await runAction(submitOpinionAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          opinionSearch: {
            docketNumber: '105-20L',
            keyword: 'a',
            opinionTypes: {},
          },
        },
      },
    });

    expect(state.alertError).toEqual({
      message: 'Please wait 1 minute before trying your search again.',
      title: "You've reached your search limit",
    });
  });

  it('should throw any other error other than 429 statusCode', async () => {
    applicationContext
      .getUseCases()
      .opinionAdvancedSearchInteractor.mockImplementation(() => {
        const e = new Error();
        e.responseCode = 500;
        throw e;
      });

    await expect(
      runAction(submitOpinionAdvancedSearchAction, {
        modules: {
          presenter,
        },
        state: {
          advancedSearchForm: {
            opinionSearch: {
              docketNumber: '105-20L',
              keyword: 'a',
              opinionTypes: {},
            },
          },
        },
      }),
    ).rejects.toThrow();
  });

  it('should filter out opinion types that are not selected for search', async () => {
    await runAction(submitOpinionAdvancedSearchAction, {
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
      applicationContext.getUseCases().opinionAdvancedSearchInteractor.mock
        .calls[0][1].searchParams.opinionTypes,
    ).toEqual(['Cucumber', 'Mango']);
  });
});
