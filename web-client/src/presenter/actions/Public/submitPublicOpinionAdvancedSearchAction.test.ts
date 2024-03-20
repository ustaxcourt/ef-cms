import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-public';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitPublicOpinionAdvancedSearchAction } from './submitPublicOpinionAdvancedSearchAction';

describe('submitPublicOpinionAdvancedSearchAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('gets the public opinion information', async () => {
    await runAction(submitPublicOpinionAdvancedSearchAction, {
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
      applicationContext.getUseCases().opinionPublicSearchInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().opinionPublicSearchInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      searchParams: {
        keyword: 'a',
      },
    });
  });

  it('should remove the docketNumberSuffix when a docket number is present', async () => {
    await runAction(submitPublicOpinionAdvancedSearchAction, {
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
      applicationContext.getUseCases().opinionPublicSearchInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().opinionPublicSearchInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      searchParams: {
        docketNumber: '105-20',
        keyword: 'a',
      },
    });
  });

  it('should set an alert if a 429 error is thrown', async () => {
    applicationContext
      .getUseCases()
      .opinionPublicSearchInteractor.mockImplementation(() => {
        const e = new Error() as any;
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

    const { state } = await runAction(submitPublicOpinionAdvancedSearchAction, {
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

  it('should filter out opinion types that are not selected for search', async () => {
    await runAction(submitPublicOpinionAdvancedSearchAction, {
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
            },
          },
        },
        form: {},
      },
    });

    expect(
      applicationContext.getUseCases().opinionPublicSearchInteractor.mock
        .calls[0][1].searchParams.opinionTypes,
    ).toEqual(['Cucumber']);
  });

  it('throw an error if response code was not 429', async () => {
    applicationContext
      .getUseCases()
      .opinionPublicSearchInteractor.mockImplementation(() => {
        const e = new Error() as any;
        e.message = 'bad request';
        e.originalError = {
          response: {
            data: {
              type: 'ip-limiter',
            },
          },
        };
        e.responseCode = 425;
        throw e;
      });

    await expect(() =>
      runAction(submitPublicOpinionAdvancedSearchAction, {
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
    ).rejects.toThrow('bad request');
  });
});
