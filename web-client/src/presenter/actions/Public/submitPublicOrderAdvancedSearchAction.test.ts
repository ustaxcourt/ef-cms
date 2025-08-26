import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-public';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitPublicOrderAdvancedSearchAction } from './submitPublicOrderAdvancedSearchAction';

describe('submitPublicOrderAdvancedSearchAction', () => {
  it('should call orderPublicSearchInteractor twice when results exceed batch size', async () => {
    let callCount = 0;
    applicationContext
      .getUseCases()
      .orderPublicSearchInteractor.mockImplementation(({ from }) => {
        callCount++;
        if (from === 0) {
          return { results: Array(5000).fill({}), totalCount: 10000 };
        }
        return { results: Array(5000).fill({}), totalCount: 10000 };
      });
    await runAction(submitPublicOrderAdvancedSearchAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {
          orderSearch: {
            keyword: 'keyword',
          },
        },
      },
    });
    expect(callCount).toBe(2);
  });
  beforeEach(() => {
    applicationContext
      .getUseCases()
      .orderPublicSearchInteractor.mockReturnValue({ results: [] });
  });
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('gets the public order information with correct searchParams', async () => {
    await runAction(submitPublicOrderAdvancedSearchAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {
          orderSearch: {
            keyword: 'a',
            startDate: '2020-01-01',
            endDate: '2020-12-31',
          },
        },
      },
    });
    expect(
      applicationContext.getUseCases().orderPublicSearchInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().orderPublicSearchInteractor.mock
        .calls[0][1].searchParams,
    ).toMatchObject({
      keyword: 'a',
      startDate: '2020-01-01',
      endDate: '2020-12-31',
      dateRange: expect.any(String),
    });
  });

  it('should remove the docketNumberSuffix when a docket number is present', async () => {
    await runAction(submitPublicOrderAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          orderSearch: {
            docketNumber: '105-20L',
            keyword: 'a',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().orderPublicSearchInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().orderPublicSearchInteractor.mock
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
      .orderPublicSearchInteractor.mockImplementation(() => {
        const e = new Error();
        (e as any).responseCode = 429;
        throw e;
      });
    const { state } = await runAction(submitPublicOrderAdvancedSearchAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {
          orderSearch: {
            docketNumber: '105-20L',
            keyword: 'a',
          },
        },
      },
    });
    expect(state.alertError).toEqual(
      applicationContext.getConstants().ERROR_429,
    );
  });
});
