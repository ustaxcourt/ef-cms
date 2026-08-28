import { state } from '@web-client/presenter/app.cerebral';

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
    case 'failed':
      store.set(state.alertError, {
        message: `Something went wrong when paying the filing fee. Please try again.`,
        title: 'Filing fee payment failed',
        overwritable: true,
      });
      break;
    case 'pending':
      store.set(state.alertWarning, {
        message: `Allow 24-48 hours for the payment status to update for docket number(s): ${paymentStatus.docketNumber}`,
        title: 'Filing fee payment is pending',
        overwritable: true,
      });
      break;
    case 'unknown':
      store.set(state.alertError, {
        message: 'Unable to verify payment status.',
        title: 'Filing fee status unknown',
        overwritable: true,
        insertContactSupportClause: true,
      });
      break;
  }
};
