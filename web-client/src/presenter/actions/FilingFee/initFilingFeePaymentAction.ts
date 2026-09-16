import { state } from '@web-client/presenter/app.cerebral';
import {
  PAYMENT_FILLING_FEE_ORIGIN,
  readPaymentFillingFeeOriginFromStorage,
} from '@web-client/presenter/actions/FilingFee/paymentFillingFeeOriginStorage';

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
    const originDashboard =
      readPaymentFillingFeeOriginFromStorage() ===
      PAYMENT_FILLING_FEE_ORIGIN.DASHBOARD;

    const options = originDashboard
      ? {
          strongTitle: true,
          title: 'Error: payment cannot be started.',
          message: `Error: payment cannot be started for ${caseDetail.docketNumber}`,
        }
      : {
          message: 'Error: payment cannot be started',
        };
    store.set(state.alertError, options);
    return path.error();
  }
};
