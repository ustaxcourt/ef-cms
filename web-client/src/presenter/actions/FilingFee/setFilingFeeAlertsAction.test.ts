import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setFilingFeeAlertsAction } from '@web-client/presenter/actions/FilingFee/setFilingFeeAlertsAction';

describe('setFilingFeeAlertsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set the success alert when payment process is success', async () => {
    const { state } = await runAction(setFilingFeeAlertsAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
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
    });

    expect(state.alertSuccess).toEqual({
      message:
        'An email was sent confirming the filing fee was paid for docket number(s): 101-20',
      title: 'Filing fee payment successful',
      overwritable: true,
    });
  });

  it('should set the warning alert when payment process is pending', async () => {
    const { state } = await runAction(setFilingFeeAlertsAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        processPaymentStatus: {
          docketNumber: '101-20',
          paymentStatus: 'pending',
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
    });

    expect(state.alertWarning).toEqual({
      message:
        'Allow 24-48 hours for the payment status to update for docket number(s): 101-20',
      title: 'Filing fee payment is pending',
      overwritable: true,
    });
  });

  it('should set the error alert when payment process fails', async () => {
    const { state } = await runAction(setFilingFeeAlertsAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        processPaymentStatus: {
          docketNumber: '101-20',
          paymentStatus: 'failed',
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
    });

    expect(state.alertError).toEqual({
      message:
        'Something went wrong when paying the filing fee. Please try again.',
      title: 'Filing fee payment failed',
      overwritable: true,
    });
  });

  it('should set the error alert for an unknown status if that status is returned', async () => {
    const { state } = await runAction(setFilingFeeAlertsAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        processPaymentStatus: {
          docketNumber: '101-20',
          paymentStatus: 'unknown',
        },
      },
    });

    expect(state.alertError).toEqual({
      message: 'Unable to verify payment status.',
      title: 'Filing fee status unknown',
      overwritable: true,
      insertContactSupportClause: true,
    });
  });
});
