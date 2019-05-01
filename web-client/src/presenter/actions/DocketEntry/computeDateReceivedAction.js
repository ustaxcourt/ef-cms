import { state } from 'cerebral';

/**
 * computes the date from a month, day and year value
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object
 * @param {Object} providers.get the cerebral get function
 */
export const computeDateReceivedAction = ({ store, get }) => {
  let formDate = null;
  const formMonth = get(state.form.dateReceivedMonth);
  const formDay = get(state.form.dateReceivedDay);
  const formYear = get(state.form.dateReceivedYear);

  if (formMonth || formDay || formYear) {
    formDate = `${formYear}-${formMonth}-${formDay}`;

    formDate = formDate
      .split('-')
      .map(segment => (segment = segment.padStart(2, '0')))
      .join('-');
  }

  store.set(state.form.dateReceived, formDate);
};
