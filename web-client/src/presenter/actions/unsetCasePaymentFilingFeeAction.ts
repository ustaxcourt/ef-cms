import { state } from '@web-client/presenter/app.cerebral';

export const unsetCasePaymentFilingFeeAction = ({
  store,
}: ActionProps): void => {
  store.unset(state.caseDetail);
  store.set(state.paymentFilingFeeOrigin, null);
};
