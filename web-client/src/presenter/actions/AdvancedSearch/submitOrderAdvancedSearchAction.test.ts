import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitOrderAdvancedSearchAction } from './submitOrderAdvancedSearchAction';

describe('submitOrderAdvancedSearchAction', () => {
  beforeEach(() => {
    applicationContext
      .getUseCases()
      .orderAdvancedSearchInteractor.mockReturnValue({
        results: [],
      });
  });
  presenter.providers.applicationContext = applicationContext;

  it('should call orderAdvancedSearchInteractor with the correct searchParams structure', async () => {
    await runAction(submitOrderAdvancedSearchAction, {
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
      applicationContext.getUseCases().orderAdvancedSearchInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().orderAdvancedSearchInteractor.mock
        .calls[0][1].searchParams,
    ).toMatchObject({
      keyword: 'a',
      startDate: '2020-01-01',
      endDate: '2020-12-31',
      dateRange: expect.any(String),
    });
  });

  it('should remove the docketNumberSuffix when a docket number is present', async () => {
    await runAction(submitOrderAdvancedSearchAction, {
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
      applicationContext.getUseCases().orderAdvancedSearchInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().orderAdvancedSearchInteractor.mock
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
      .orderAdvancedSearchInteractor.mockImplementation(() => {
        const e = new Error();
        (e as any).responseCode = 429;
        throw e;
      });
    const { state } = await runAction(submitOrderAdvancedSearchAction, {
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

  it('should throw any other error other than 429 responseCode', async () => {
    applicationContext
      .getUseCases()
      .orderAdvancedSearchInteractor.mockImplementation(() => {
        const e = new Error('bad request');
        (e as any).responseCode = 500;
        throw e;
      });
    await expect(
      runAction(submitOrderAdvancedSearchAction, {
        modules: { presenter },
        state: {
          advancedSearchForm: {
            orderSearch: {
              docketNumber: '105-20L',
              keyword: 'a',
            },
          },
        },
      }),
    ).rejects.toThrow('bad request');
  });
});
