import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setFilingFeeAlertsAction } from '@web-client/presenter/actions/FilingFee/setFilingFeeAlertsAction';
import { PAYMENT_DECLINED_MESSAGES } from '@shared/business/entities/EntityConstants';

describe('setFilingFeeAlertsAction', () => {
  let stateMock;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    stateMock = {
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
    };
  });

  it('should set the success alert when payment process is success', async () => {
    const { state } = await runAction(setFilingFeeAlertsAction, {
      modules: {
        presenter,
      },
      props: {},
      state: stateMock,
    });

    expect(state.alertSuccess).toEqual({
      message:
        'An email was sent confirming the filing fee was paid for docket number(s): 101-20',
      title: 'Filing fee payment successful',
      overwritable: true,
    });
  });

  it('should set the warning alert when payment process is pending', async () => {
    stateMock.processPaymentStatus.paymentStatus = 'pending';
    stateMock.processPaymentStatus.transactions[0].transactionStatus =
      'pending';
    const { state } = await runAction(setFilingFeeAlertsAction, {
      modules: {
        presenter,
      },
      props: {},
      state: stateMock,
    });

    expect(state.alertWarning).toEqual({
      message:
        'Allow 24-48 hours for the payment status to update for docket number(s): 101-20',
      title: 'Filing fee payment is pending',
      overwritable: true,
    });
  });

  it('should set the error alert as default text when payment process fails with unknown payment method', async () => {
    stateMock.processPaymentStatus.paymentStatus = 'failed';
    stateMock.processPaymentStatus.transactions[0].paymentMethod = 'fakeMethod';

    const { state } = await runAction(setFilingFeeAlertsAction, {
      modules: {
        presenter,
      },
      props: {},
      state: stateMock,
    });

    expect(state.alertError).toEqual({
      message:
        'Something went wrong when paying the filing fee. Please try again.',
      title: 'Filing fee payment failed',
      overwritable: true,
    });
  });

  it('should set the error alert as default text when payment process fails without a payment method', async () => {
    stateMock.processPaymentStatus.paymentStatus = 'failed';
    delete stateMock.processPaymentStatus.transactions[0].paymentMethod;

    const { state } = await runAction(setFilingFeeAlertsAction, {
      modules: {
        presenter,
      },
      props: {},
      state: stateMock,
    });

    expect(state.alertError).toEqual({
      message:
        'Something went wrong when paying the filing fee. Please try again.',
      title: 'Filing fee payment failed',
      overwritable: true,
    });
  });

  it('should set the error alert as default text when payment process fails with no transactions', async () => {
    stateMock.processPaymentStatus.paymentStatus = 'failed';
    stateMock.processPaymentStatus.transactions = [];

    const { state } = await runAction(setFilingFeeAlertsAction, {
      modules: {
        presenter,
      },
      props: {},
      state: stateMock,
    });

    expect(state.alertError).toEqual({
      message:
        'Something went wrong when paying the filing fee. Please try again.',
      title: 'Filing fee payment failed',
      overwritable: true,
    });
  });

  it.each(
    Object.entries(PAYMENT_DECLINED_MESSAGES).map(
      ([paymentMethod, expectedReason]) => [
        'failed',
        paymentMethod,
        expectedReason,
      ],
    ),
  )(
    'should set the error alert for paymentStatus %s and paymentMethod %s',
    async (paymentStatus, paymentMethod, expectedReason) => {
      stateMock.processPaymentStatus.paymentStatus = paymentStatus;
      stateMock.processPaymentStatus.transactions[0].paymentMethod =
        paymentMethod;

      const { state } = await runAction(setFilingFeeAlertsAction, {
        modules: {
          presenter,
        },
        props: {},
        state: stateMock,
      });

      expect(state.alertError).toEqual({
        message: `${expectedReason}. Please try again.`,
        title: 'Filing fee payment failed',
        overwritable: true,
      });
    },
  );

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
      className: 'usa-alert--filing-fee-status-unknown',
      filingFeePaymentStatusDocketNumber: '101-20',
      message: 'Unable to verify payment status for',
      title: 'Filing fee status unknown',
      overwritable: true,
      insertContactSupportClause: true,
    });
  });
});
