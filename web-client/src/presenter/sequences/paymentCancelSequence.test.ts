import { CerebralTest } from 'cerebral/test';
import { PAYMENT_FILING_FEE_ORIGIN } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { paymentCancelSequence } from '@web-client/presenter/sequences/paymentCancelSequence';
import { presenter } from '../presenter-mock';

describe('paymentCancelSequence', () => {
  let cerebralTest: ReturnType<typeof CerebralTest>;

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
  });

  it('should route to the dashboard through navigateToPathAction when origin is dashboard', async () => {
    await cerebralTest.runSequence('paymentCancelSequence', {
      docketNumber: '101-20',
      origin: PAYMENT_FILING_FEE_ORIGIN.DASHBOARD,
    });

    expect(presenter.providers.router.route).toHaveBeenCalledWith('/');
  });
});
