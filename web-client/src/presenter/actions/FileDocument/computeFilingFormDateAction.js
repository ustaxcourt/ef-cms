import { state } from 'cerebral';

/**
 * computes the filingDate from a month, day and year value and add as prop
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.get the cerebral get function
 * @returns {void}
 */
export const computeFilingFormDateAction = ({ get, store }) => {
  let formDate = null;
  const formMonth = get(state.form.filingDateMonth);
  const formDay = get(state.form.filingDateDay);
  const formYear = get(state.form.filingDateYear);

  if (formMonth && formDay && formYear) {
    formDate = `${formYear}-${formMonth}-${formDay}`;

    formDate = formDate
      .split('-')
      .map(segment => segment.padStart(2, '0'))
      .join('-');

    store.set(state.form.filingDate, formDate);
  }
};
