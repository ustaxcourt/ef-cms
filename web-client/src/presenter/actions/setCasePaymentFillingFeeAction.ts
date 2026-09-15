import { state } from '@web-client/presenter/app.cerebral';

export const setCasePaymentFillingFeeAction = ({
  props,
  store,
}: ActionProps<{ caseDetail: RawCase }>) => {
  store.set(state.caseDetail, props.caseDetail);
};
