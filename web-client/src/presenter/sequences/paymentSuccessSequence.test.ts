import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { paymentSuccessSequence } from '@web-client/presenter/sequences/paymentSuccessSequence';
import { presenter } from '../presenter-mock';

describe('paymentSuccessSequence', () => {
  let cerebralTest: ReturnType<typeof CerebralTest>;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      route: jest.fn().mockResolvedValue(undefined),
    };
    presenter.sequences = {
      paymentSuccessSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    cerebralTest.setState('dashboardCaseListPageIndex', undefined);

    applicationContext
      .getUseCases()
      .processPaymentInteractor.mockResolvedValue({
        paymentStatus: 'success',
      });
  });

  it('should restore dashboard open-cases pagination from the page query before navigating home', async () => {
    await cerebralTest.runSequence('paymentSuccessSequence', {
      docketNumber: '101-20',
      page: '2',
    });

    expect(cerebralTest.getState('dashboardCaseListPageIndex')).toEqual(1);
    expect(presenter.providers.router.route).toHaveBeenCalledWith('/');
  });

  it('should clear stored pagination when the return page is the first page', async () => {
    cerebralTest.setState('dashboardCaseListPageIndex', 3);

    await cerebralTest.runSequence('paymentSuccessSequence', {
      docketNumber: '101-20',
      page: '1',
    });

    expect(cerebralTest.getState('dashboardCaseListPageIndex')).toBeUndefined();
    expect(presenter.providers.router.route).toHaveBeenCalledWith('/');
  });
});
