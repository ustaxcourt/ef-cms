import { PublicClientState } from '@web-client/presenter/state-public';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-public';
import { runAction } from '@web-client/presenter/test.cerebral';
import { MAX_DOCUMENT_SEARCH_RESULTS } from '@shared/business/entities/EntityConstants';
import { submitPublicOpinionAdvancedSearchAction } from './submitPublicOpinionAdvancedSearchAction';

describe('submitPublicOpinionAdvancedSearchAction', () => {
  it('should call opinionPublicSearchInteractor only once', async () => {
    applicationContext
      .getUseCases()
      .opinionPublicSearchInteractor.mockReturnValue({
        results: Array(MAX_DOCUMENT_SEARCH_RESULTS).fill({}),
      });
    await runAction(submitPublicOpinionAdvancedSearchAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {
          opinionSearch: {
            keyword: 'keyword',
            opinionTypes: { TCOP: true, SOP: true },
          },
        },
      },
    });
    expect(
      applicationContext.getUseCases().opinionPublicSearchInteractor.mock.calls
        .length,
    ).toBe(1);
  });
  beforeEach(() => {
    applicationContext
      .getUseCases()
      .opinionPublicSearchInteractor.mockReturnValue({
        results: [],
      });
  });
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('gets the public opinion information with correct searchParams and filtered opinionTypes', async () => {
    await runAction(submitPublicOpinionAdvancedSearchAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {
          opinionSearch: {
            keyword: 'a',
            opinionTypes: { TCOP: true, SOP: false },
          },
        },
      },
    });
    expect(
      applicationContext.getUseCases().opinionPublicSearchInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().opinionPublicSearchInteractor.mock
        .calls[0][1].searchParams,
    ).toMatchObject({
      keyword: 'a',
      opinionTypes: ['TCOP'],
    });
  });

  it('should remove the docketNumberSuffix when a docket number is present', async () => {
    await runAction<{ searchResults: any }, PublicClientState>(
      submitPublicOpinionAdvancedSearchAction,
      {
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
      },
    );

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
        const e = new Error();
        (e as any).responseCode = 429;
        throw e;
      });
    const { state } = await runAction(submitPublicOpinionAdvancedSearchAction, {
      modules: { presenter },
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
    expect(state.alertError).toEqual(
      applicationContext.getConstants().ERROR_429,
    );
  });

  it('should filter out opinion types that are not selected for search', async () => {
    await runAction<{ searchResults: any }, PublicClientState>(
      submitPublicOpinionAdvancedSearchAction,
      {
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
      },
    );

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
      runAction<{ searchResults: any }, PublicClientState>(
        submitPublicOpinionAdvancedSearchAction,
        {
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
        },
      ),
    ).rejects.toThrow('bad request');
  });
});
