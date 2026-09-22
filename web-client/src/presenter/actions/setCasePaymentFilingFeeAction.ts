import { PAYMENT_FILING_FEE_ORIGIN } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setCasePaymentFilingFeeAction = ({
  props,
  store,
}: ActionProps<{ caseDetail: RawCase }>): void => {
  store.set(state.caseDetail, props.caseDetail);
  store.set(state.paymentFilingFeeOrigin, PAYMENT_FILING_FEE_ORIGIN.DASHBOARD);
};
