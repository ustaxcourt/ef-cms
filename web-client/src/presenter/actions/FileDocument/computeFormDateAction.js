import { state } from 'cerebral';

/**
 * computes the date from a month, day and year value
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.get the cerebral get function
 */
export const computeFormDateAction = ({ get, store }) => {
  const year = get(state.form.year);
  const month = get(state.form.month);
  const day = get(state.form.day);

  if (year && month && day) {
    let formDate = `${year}-${month}-${day}`;

    formDate = formDate
      .split('-')
      .map(segment => segment.padStart(2, '0'))
      .join('-');

    store.set(state.form.serviceDate, formDate);
  } else {
    store.unset(state.form.serviceDate);
  }
};
