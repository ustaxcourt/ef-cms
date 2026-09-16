import {
  PAYMENT_FILLING_FEE_ORIGIN,
  persistPaymentFillingFeeOrigin,
} from '@web-client/presenter/actions/FilingFee/paymentFillingFeeOriginStorage';
import { state } from '@web-client/presenter/app.cerebral';

export const setCasePaymentFillingFeeAction = ({
  props,
  store,
}: ActionProps<{ caseDetail: RawCase }>) => {
  store.set(state.caseDetail, props.caseDetail);
  persistPaymentFillingFeeOrigin(PAYMENT_FILLING_FEE_ORIGIN.DASHBOARD);
};
