import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitOrderAdvancedSearchAction } from './submitOrderAdvancedSearchAction';

describe('submitOrderAdvancedSearchAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should call orderAdvancedSearchInteractor with the state.advancedSearchForm as searchParams', async () => {
    await runAction(submitOrderAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          orderSearch: {
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
        keyword: 'a',
      },
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

  it('should set the error alert if 429 statusCode is returned', async () => {
    applicationContext
      .getUseCases()
      .orderAdvancedSearchInteractor.mockImplementation(() => {
        const e = new Error();
        e.responseCode = 429;
        throw e;
      });

    const { state } = await runAction(submitOrderAdvancedSearchAction, {
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

    expect(state.alertError).toEqual({
      message: 'Please wait 1 minute before trying your search again.',
      title: "You've reached your search limit.",
    });
  });

  it('should throw any other error other than 429 statusCode', async () => {
    applicationContext
      .getUseCases()
      .orderAdvancedSearchInteractor.mockImplementation(() => {
        const e = new Error();
        e.responseCode = 500;
        throw e;
      });

    await expect(
      runAction(submitOrderAdvancedSearchAction, {
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
      }),
    ).rejects.toThrow();
  });
});
