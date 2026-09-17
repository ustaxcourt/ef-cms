import { state } from '@web-client/presenter/app.cerebral';
import { PAYMENT_FILLING_FEE_ORIGIN } from '@web-client/presenter/actions/FilingFee/paymentFillingFeeOrigin';

export const initFilingFeePaymentAction = async ({
  get,
  applicationContext,
  store,
  path,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const originDashboard =
    get(state.paymentFillingFeeOrigin) === PAYMENT_FILLING_FEE_ORIGIN.DASHBOARD;

  try {
    const result = await applicationContext
      .getUseCases()
      .initPaymentInteractor(applicationContext, {
        docketNumber: caseDetail.docketNumber,
        filingFeeReturnOrigin: originDashboard ? 'dashboard' : 'petition',
      });
    window.location.href = result.paymentRedirect;
    return path.success();
  } catch (e) {
    const options = originDashboard
      ? {
          titleClass: 'tw:font-bold tw:text-lg tw:leading-7',
          title: 'Error: payment cannot be started.',
          messageClass: 'tw:font-normal tw:text-xl tw:leading-7',
          message: `Payment cannot be started for ${caseDetail.docketNumber}`,
          scrollToErrorNotification: true,
        }
      : {
          message: 'Error: payment cannot be started',
        };
    store.set(state.alertError, options);
    return path.error();
  }
};
