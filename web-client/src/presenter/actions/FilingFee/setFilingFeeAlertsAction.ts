import { state } from '@web-client/presenter/app.cerebral';
import {
  DEFAULT_PAYMENT_DECLINED_MESSAGES,
  DEFAULT_PAYMENT_FAILED_MESSAGE,
} from '@shared/business/entities/EntityConstants';
import { ProcessPaymentResponse } from 'node_modules/@ustaxcourt/payment-portal/dist';

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
      const reason = getPaymentFailureReason(paymentStatus);
      const reasonFormatted = appendPeriodIfNotThere(reason);
      store.set(state.alertError, {
        message: `${reasonFormatted} Please try again.`,
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

const getPaymentFailureReason = (paymentStatus: ProcessPaymentResponse) => {
  if (paymentStatus.transactions.length === 0) {
    return DEFAULT_PAYMENT_FAILED_MESSAGE;
  }
  const lastTransaction =
    paymentStatus.transactions[paymentStatus.transactions.length - 1];
  const { paymentMethod, returnDetail } = lastTransaction;
  if (returnDetail) return returnDetail;

  if (!paymentMethod) return DEFAULT_PAYMENT_FAILED_MESSAGE;

  const { [paymentMethod]: failureMessage = DEFAULT_PAYMENT_FAILED_MESSAGE } =
    DEFAULT_PAYMENT_DECLINED_MESSAGES;
  return failureMessage;
};

const appendPeriodIfNotThere = (message: string) => {
  if (!message.endsWith('.')) {
    return message + '.';
  }
  return message;
};
