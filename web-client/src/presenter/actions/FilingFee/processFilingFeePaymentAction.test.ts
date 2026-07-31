import { processFilingFeePaymentAction } from '@web-client/presenter/actions/FilingFee/processFilingFeePaymentAction';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('processFilingFeePaymentAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set processPaymentStatus.paymentStatus to failed if an error is thrown', async () => {
    applicationContext
      .getUseCases()
      .processPaymentInteractor.mockRejectedValueOnce(new Error());

    const result = await runAction(processFilingFeePaymentAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '101-20',
      },
    });

    expect(result.output).toEqual({
      processPaymentStatus: {
        paymentStatus: 'failed',
      },
    });
  });

  it('should processPaymentStatus to the API call result if successful', async () => {
    applicationContext
      .getUseCases()
      .processPaymentInteractor.mockResolvedValue({
        paymentStatus: 'success',
        transactions: [
          {
            payGovTrackingId: 'payGovTrackingId',
            transactionStatus: 'processed',
            paymentMethod: 'PayPal',
            createdTimestamp: '2026-07-01T00:00:00.000Z',
            updatedTimestamp: '2026-07-01T00:00:00.000Z',
          },
        ],
      });

    const result = await runAction(processFilingFeePaymentAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '101-20',
      },
    });

    expect(result.output).toEqual({
      processPaymentStatus: {
        docketNumber: '101-20',
        paymentStatus: 'success',
        transactions: [
          {
            payGovTrackingId: 'payGovTrackingId',
            transactionStatus: 'processed',
            paymentMethod: 'PayPal',
            createdTimestamp: '2026-07-01T00:00:00.000Z',
            updatedTimestamp: '2026-07-01T00:00:00.000Z',
          },
        ],
      },
    });
  });
});
