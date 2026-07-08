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

  store.set(state.processPaymentStatus, {
    docketNumber: props.docketNumber,
    ...result,
  });

  return alerts;
};
