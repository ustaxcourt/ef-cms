import { state } from 'cerebral';

/**
 * computes the date from a month, day and year value and add as prop
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} {computedDate}
 */
export const computeFormDateAction = ({ get }) => {
  let formDate = null;
  const formMonth = get(state.form.month);
  const formDay = get(state.form.day);
  const formYear = get(state.form.year);

  if (formMonth && formDay && formYear) {
    formDate = `${formYear}-${formMonth}-${formDay}`;

    formDate = formDate
      .split('-')
      .map(segment => segment.padStart(2, '0'))
      .join('-');
  }

  return { computedDate: formDate };
};
