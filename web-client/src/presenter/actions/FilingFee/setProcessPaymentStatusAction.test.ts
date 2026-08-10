import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setProcessPaymentStatusAction } from '@web-client/presenter/actions/FilingFee/setProcessPaymentStatusAction';

describe('SetProcessPaymentStatusAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set the payment process status in state', async () => {
    const { state } = await runAction(setProcessPaymentStatusAction, {
      modules: {
        presenter,
      },
      props: {
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
      },
      state: {},
    });

    expect(state.processPaymentStatus).toEqual({
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
    });
  });
});
