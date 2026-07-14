import { state } from '@web-client/presenter/app.cerebral';

export const initFilingFeePaymentAction = async ({
  get,
  applicationContext,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const result = await applicationContext
    .getUseCases()
    .initPaymentInteractor(applicationContext, {
      docketNumber: caseDetail.docketNumber,
    });
  window.location.href = result.paymentRedirect;
};
