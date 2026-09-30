import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { initMyCasesFilingFeePaymentSequence } from '@web-client/presenter/sequences/initMyCasesFilingFeePaymentSequence';
import { presenter } from '../presenter-mock';
import { PAYMENT_FILING_FEE_ORIGIN } from '@shared/business/entities/EntityConstants';

describe('initMyCasesFilingFeePaymentSequence', () => {
  let cerebralTest: CerebralTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      initMyCasesFilingFeePaymentSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  beforeEach(() => {
    applicationContext.getUseCases().initPaymentInteractor.mockReset();
    cerebralTest.setState('progressIndicator', {
      waitingForResponse: false,
      waitingForResponseRequests: 0,
    });
    cerebralTest.setState('caseDetail', null);
    cerebralTest.setState('paymentFilingFeeOrigin', null);
    cerebralTest.setState('alertError', null);
  });

  it('should clear the loading overlay when init payment fails', async () => {
    applicationContext
      .getUseCases()
      .initPaymentInteractor.mockRejectedValue(
        new Error('payment unavailable'),
      );

    await cerebralTest.runSequence('initMyCasesFilingFeePaymentSequence', {
      caseDetail: { docketNumber: '101-20' },
    });

    expect(cerebralTest.getState('progressIndicator')).toMatchObject({
      waitingForResponse: false,
      waitingForResponseRequests: 0,
    });
    expect(cerebralTest.getState('alertError')).toMatchObject({
      title: 'Error: payment cannot be started.',
    });
    expect(cerebralTest.getState('paymentFilingFeeOrigin')).toBeNull();
  });

  it('should set dashboard origin before init and clear overlay on success redirect', async () => {
    applicationContext.getUseCases().initPaymentInteractor.mockResolvedValue({
      paymentRedirect: 'http://localhost:3366/pay',
    });

    await cerebralTest.runSequence('initMyCasesFilingFeePaymentSequence', {
      caseDetail: { docketNumber: '101-20' },
    });

    expect(cerebralTest.getState('progressIndicator')).toMatchObject({
      waitingForResponse: false,
      waitingForResponseRequests: 0,
    });
    expect(cerebralTest.getState('paymentFilingFeeOrigin')).toBeNull();
    expect(
      applicationContext.getUseCases().initPaymentInteractor,
    ).toHaveBeenCalledWith(expect.anything(), {
      docketNumber: '101-20',
      filingFeeReturnOrigin: PAYMENT_FILING_FEE_ORIGIN.DASHBOARD,
    });
  });
});
