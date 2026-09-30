import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { initFilingFeePaymentSequence } from '@web-client/presenter/sequences/initFilingFeePaymentSequence';
import { presenter } from '../presenter-mock';

describe('initFilingFeePaymentSequence', () => {
  let cerebralTest: CerebralTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      initFilingFeePaymentSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  beforeEach(() => {
    applicationContext.getUseCases().initPaymentInteractor.mockReset();
    cerebralTest.setState('progressIndicator', {
      waitingForResponse: false,
      waitingForResponseRequests: 0,
    });
    cerebralTest.setState('caseDetail', { docketNumber: '101-20' });
    cerebralTest.setState('alertError', null);
  });

  it('should clear the loading overlay when init payment fails', async () => {
    applicationContext
      .getUseCases()
      .initPaymentInteractor.mockRejectedValue(
        new Error('payment unavailable'),
      );

    await cerebralTest.runSequence('initFilingFeePaymentSequence');

    expect(cerebralTest.getState('progressIndicator')).toMatchObject({
      waitingForResponse: false,
      waitingForResponseRequests: 0,
    });
    expect(cerebralTest.getState('alertError')).toMatchObject({
      message: 'Error: payment cannot be started',
    });
  });
});
