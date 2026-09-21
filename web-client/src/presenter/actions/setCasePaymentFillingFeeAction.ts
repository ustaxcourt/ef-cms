import { PAYMENT_FILLING_FEE_ORIGIN } from '@web-client/presenter/actions/FilingFee/paymentFillingFeeOrigin';
import { state } from '@web-client/presenter/app.cerebral';

export const setCasePaymentFillingFeeAction = ({
  props,
  store,
}: ActionProps<{ caseDetail: RawCase }>): void => {
  store.set(state.caseDetail, props.caseDetail);
  store.set(
    state.paymentFillingFeeOrigin,
    PAYMENT_FILLING_FEE_ORIGIN.DASHBOARD,
  );
};
