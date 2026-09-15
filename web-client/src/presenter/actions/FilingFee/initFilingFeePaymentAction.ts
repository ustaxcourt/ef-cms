import { state } from '@web-client/presenter/app.cerebral';

export const initFilingFeePaymentAction = async ({
  get,
  applicationContext,
  store,
  path,
  props,
}: ActionProps<{ docketNumber?: string }>) => {
  const docketNumber = props.docketNumber || get(state.caseDetail.docketNumber);
  try {
    const result = await applicationContext
      .getUseCases()
      .initPaymentInteractor(applicationContext, {
        docketNumber: docketNumber,
      });
    window.location.href = result.paymentRedirect;
    return path.success();
  } catch (e) {
    store.set(state.alertError, {
      message: 'Error: payment cannot be started',
    });
    return path.error();
  }
};
