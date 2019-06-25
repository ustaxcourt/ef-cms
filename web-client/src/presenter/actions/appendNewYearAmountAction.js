import { state } from 'cerebral';

/**
 * Creates and appends a new "blank" year amount object to the yearAmounts array for when a user needs to add another
 * year amount to the petition document info.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {Function} providers.get the cerebral get helper function
 */
export const appendNewYearAmountAction = ({ get, store }) => {
  const caseDetail = get(state.caseDetail);
  const emptyYearAmounts = (caseDetail.yearAmounts || []).filter(yearAmount => {
    return !yearAmount.year;
  });
  if (emptyYearAmounts.length < 2) {
    store.set(state.caseDetail.yearAmounts, [
      ...caseDetail.yearAmounts,
      {
        amount: '',
        year: '',
      },
    ]);
  }
};
