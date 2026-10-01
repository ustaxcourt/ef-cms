import { CerebralTest } from 'cerebral/test';
import { PAYMENT_FILING_FEE_ORIGIN } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { paymentCancelSequence } from '@web-client/presenter/sequences/paymentCancelSequence';
import { presenter } from '../presenter-mock';

describe('paymentCancelSequence', () => {
  let cerebralTest: ReturnType<typeof CerebralTest>;

  const mockOpenCases = [{ docketNumber: '101-20' }];
  const mockClosedCases = [{ docketNumber: '102-20' }];

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      route: jest.fn().mockResolvedValue(undefined),
    };
    presenter.sequences = {
      paymentCancelSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Each test must start from a page other than the dashboard so assertions about
    // reaching the dashboard cannot pass on state left behind by a previous test.
    cerebralTest.setState('currentPage', 'FilePetition');
    cerebralTest.setState('openCases', []);
    cerebralTest.setState('closedCases', []);

    applicationContext.getUseCases().getCasesForUserInteractor.mockReturnValue({
      closedCaseList: mockClosedCases,
      openCaseList: mockOpenCases,
    });
  });

  describe('dashboard origin', () => {
    it('should render the My Cases dashboard without routing through an interstitial page', async () => {
      await cerebralTest.runSequence('paymentCancelSequence', {
        docketNumber: '101-20',
        origin: PAYMENT_FILING_FEE_ORIGIN.DASHBOARD,
      });

      expect(cerebralTest.getState('currentPage')).toEqual(
        'DashboardExternalUser',
      );
      expect(presenter.providers.router.route).not.toHaveBeenCalled();
    });

    it('should load the case list before rendering the dashboard so the zero-case welcome page is never shown', async () => {
      const currentPageWhenCasesRequested = jest.fn();

      applicationContext
        .getUseCases()
        .getCasesForUserInteractor.mockImplementation(() => {
          currentPageWhenCasesRequested(cerebralTest.getState('currentPage'));
          return {
            closedCaseList: mockClosedCases,
            openCaseList: mockOpenCases,
          };
        });

      await cerebralTest.runSequence('paymentCancelSequence', {
        docketNumber: '101-20',
        origin: PAYMENT_FILING_FEE_ORIGIN.DASHBOARD,
      });

      expect(currentPageWhenCasesRequested).toHaveBeenCalledTimes(1);
      const [pageWhenRequested] = currentPageWhenCasesRequested.mock
        .calls[0] as string[];
      expect(pageWhenRequested).not.toEqual('DashboardExternalUser');

      expect(cerebralTest.getState('openCases')).toEqual(mockOpenCases);
      expect(cerebralTest.getState('closedCases')).toEqual(mockClosedCases);
      expect(cerebralTest.getState('currentPage')).toEqual(
        'DashboardExternalUser',
      );
    });

    it('should clear the payment filing fee origin', async () => {
      cerebralTest.setState(
        'paymentFilingFeeOrigin',
        PAYMENT_FILING_FEE_ORIGIN.DASHBOARD,
      );

      await cerebralTest.runSequence('paymentCancelSequence', {
        docketNumber: '101-20',
        origin: PAYMENT_FILING_FEE_ORIGIN.DASHBOARD,
      });

      expect(cerebralTest.getState('paymentFilingFeeOrigin')).toBeNull();
    });
  });
});
