import { state } from 'cerebral';

export default async ({ store, get }) => {
  const caseDetail = get(state.caseDetail);
  const emptyYearAmounts = (caseDetail.yearAmounts || []).filter(yearAmount => {
    return !yearAmount.year;
  });
  if (emptyYearAmounts.length < 2) {
    store.set(state.caseDetail.yearAmounts, [
      ...caseDetail.yearAmounts,
      {
        year: '',
        amount: '',
      },
    ]);
  }
};
