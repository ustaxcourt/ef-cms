import { ProcessPaymentResponse } from '@ustaxcourt/payment-portal/dist';
import { state } from '@web-client/presenter/app.cerebral';

type PaymentMethod = NonNullable<
  ProcessPaymentResponse['transactions'][number]['paymentMethod']
>;

const PAYMENT_DECLINED_MESSAGES: Record<PaymentMethod, string> = {
  ACH: 'ACH payment declined',
  'Credit/Debit Card': 'Credit card declined',
  PayPal: 'PayPal declined',
};

const DEFAULT_PAYMENT_FAILED_MESSAGE =
  'Something went wrong when paying the filing fee';

export const setFilingFeeAlertsAction = ({ get, store }: ActionProps) => {
  const paymentStatus = get(state.processPaymentStatus);
  if (!paymentStatus) return;
  store.unset(state.processPaymentStatus);
  switch (paymentStatus.paymentStatus) {
    case 'success':
      store.set(state.alertSuccess, {
        message: `An email was sent confirming the filing fee was paid for docket number(s): ${paymentStatus.docketNumber}`,
        title: 'Filing fee payment successful',
        overwritable: true,
      });
      break;
    case 'failed': {
      const paymentMethod = paymentStatus.transactions.at(-1)?.paymentMethod;
      const reason =
        (paymentMethod && PAYMENT_DECLINED_MESSAGES[paymentMethod]) ??
        DEFAULT_PAYMENT_FAILED_MESSAGE;
      store.set(state.alertError, {
        message: `${reason}. Please try again.`,
        title: 'Filing fee payment failed',
        overwritable: true,
      });
      break;
    }
    case 'pending':
      store.set(state.alertWarning, {
        message: `Allow 24-48 hours for the payment status to update for docket number(s): ${paymentStatus.docketNumber}`,
        title: 'Filing fee payment is pending',
        overwritable: true,
      });
      break;
    case 'unknown':
      store.set(state.alertError, {
        className: 'usa-alert--filing-fee-status-unknown',
        filingFeePaymentStatusDocketNumber: paymentStatus.docketNumber,
        message: 'Unable to verify payment status for',
        title: 'Filing fee status unknown',
        overwritable: true,
        insertContactSupportClause: true,
      });
      break;
  }
};
