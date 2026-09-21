import { PAYMENT_FILING_FEE_ORIGIN } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setCasePaymentFillingFeeAction = ({
  props,
  store,
}: ActionProps<{ caseDetail: RawCase }>): void => {
  store.set(state.caseDetail, props.caseDetail);
  store.set(state.paymentFillingFeeOrigin, PAYMENT_FILING_FEE_ORIGIN.DASHBOARD);
};
