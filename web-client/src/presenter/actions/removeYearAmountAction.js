import { state } from 'cerebral';

export default async ({ store, get, props }) => {
  const caseDetail = get(state.caseDetail);
  const { index } = props;
  store.set(
    state.caseDetail.yearAmounts,
    caseDetail.yearAmounts.filter((value, idx) => idx !== index),
  );
};
