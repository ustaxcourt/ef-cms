import { state } from '@web-client/presenter/app.cerebral';

export const processFilingFeePaymentAction = async ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const result = await applicationContext
    .getUseCases()
    .processPaymentInteractor(applicationContext, {
      docketNumber: props.docketNumber,
    });

  const alerts: any = {};

  store.set(state.processPaymentStatus, result);

  switch (result.processPaymentRepsone.paymentStatus) {
    case 'success':
      store.set(state.alertSuccess, {
        message: `An email was sent confirming the filing fee was paid for docket number(s): ${props.docketNumber}`,
        title: 'Filing fee payment successful',
        overwritable: true,
      });
      break;
    case 'failed':
      console.log('asdf');
      alerts.alertError = {
        message: `Something went wrong when paying the filing fee. Please try again.`,
        title: 'Filing fee payment failed',
        overwritable: true,
      };
      store.set(state.alertError, alerts.alertError);
      break;
    case 'pending':
      store.set(state.alertWarning, {
        message: `Allow 24-48 hours for the payment status to update for docket number(s): ${props.docketNumber}`,
        title: 'Filing fee payment is pending',
        overwritable: true,
      });
      break;
  }

  return alerts;
};
