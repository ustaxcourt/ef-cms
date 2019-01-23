import { state } from 'cerebral';

export default async ({ store, get }) => {
  const caseDetail = get(state.caseDetail);
  store.set(state.caseDetail.yearAmounts, [
    ...caseDetail.yearAmounts,
    { year: '', amount: '' },
  ]);
};
