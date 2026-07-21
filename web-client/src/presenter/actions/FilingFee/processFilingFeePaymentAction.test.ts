import { processFilingFeePaymentAction } from '@web-client/presenter/actions/FilingFee/processFilingFeePaymentAction';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('processFilingFeePaymentAction', () => {
  let pathSuccessStub;
  let pathErrorStub;

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    pathSuccessStub = jest.fn();
    pathErrorStub = jest.fn();

    presenter.providers.path = {
      success: pathSuccessStub,
      error: pathErrorStub,
    };
  });

  it('should call the error path if an error is thrown', async () => {
    applicationContext
      .getUseCases()
      .processPaymentInteractor.mockRejectedValueOnce(new Error());

    await runAction(processFilingFeePaymentAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '101-20',
      },
    });

    expect(pathErrorStub).toHaveBeenCalled();
  });

  it('should call the success path if API call is successful', async () => {
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

    await runAction(processFilingFeePaymentAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '101-20',
      },
    });

    expect(pathSuccessStub).toHaveBeenCalledWith({
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
