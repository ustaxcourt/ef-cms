import { state } from '@web-client/presenter/app.cerebral';

export const unsetCasePaymentFillingFeeAction = ({ store }: ActionProps) => {
  store.unset(state.caseDetail);
  store.set(state.paymentFillingFeeOrigin, null);
};
