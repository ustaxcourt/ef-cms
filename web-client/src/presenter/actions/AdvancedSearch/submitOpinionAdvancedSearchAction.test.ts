import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitOpinionAdvancedSearchAction } from './submitOpinionAdvancedSearchAction';

describe('submitOpinionAdvancedSearchAction', () => {
  it('should call opinionAdvancedSearchInteractor twice when results exceed batch size', async () => {
    let callCount = 0;
    applicationContext
      .getUseCases()
      .opinionAdvancedSearchInteractor.mockImplementation(({ from }) => {
        callCount++;
        if (from === 0) {
          return { results: Array(5000).fill({}), totalCount: 10000 };
        }
        return { results: Array(5000).fill({}), totalCount: 10000 };
      });
    await runAction(submitOpinionAdvancedSearchAction, {
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
    expect(callCount).toBe(2);
  });
  presenter.providers.applicationContext = applicationContext;

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .opinionAdvancedSearchInteractor.mockReturnValue({ results: [] });
  });

  it('should call opinionAdvancedSearchInteractor with the correct searchParams structure and filtered opinionTypes', async () => {
    await runAction(submitOpinionAdvancedSearchAction, {
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
      applicationContext.getUseCases().opinionAdvancedSearchInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().opinionAdvancedSearchInteractor.mock
        .calls[0][1].searchParams,
    ).toMatchObject({
      keyword: 'a',
      opinionTypes: ['TCOP'],
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

  it('should set the error alert if 429 responseCode is returned', async () => {
    applicationContext
      .getUseCases()
      .opinionAdvancedSearchInteractor.mockImplementation(() => {
        const e = new Error();
        (e as any).responseCode = 429;
        throw e;
      });
    const { state } = await runAction(submitOpinionAdvancedSearchAction, {
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

  it('should throw any other error other than 429 responseCode', async () => {
    applicationContext
      .getUseCases()
      .opinionAdvancedSearchInteractor.mockImplementation(() => {
        const e = new Error('bad request');
        (e as any).responseCode = 500;
        throw e;
      });
    await expect(
      runAction(submitOpinionAdvancedSearchAction, {
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
      }),
    ).rejects.toThrow('bad request');
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
