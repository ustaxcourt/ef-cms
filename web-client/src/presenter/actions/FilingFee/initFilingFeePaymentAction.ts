import { state } from '@web-client/presenter/app.cerebral';

export const initFilingFeePaymentAction = async ({
  get,
  applicationContext,
  store,
  path,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  try {
    const result = await applicationContext
      .getUseCases()
      .initPaymentInteractor(applicationContext, {
        docketNumber: caseDetail.docketNumber,
      });
    window.location.href = result.paymentRedirect;
    return path.success();
  } catch (e) {
    console.log('Error calling init filing fee payment');
    store.set(state.alertError, {
      message: 'Error calling init filing fee payment',
    });
    return path.error();
  }
};
