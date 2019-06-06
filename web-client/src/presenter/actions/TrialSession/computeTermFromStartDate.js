import { state } from 'cerebral';

/**
 * computes the term (Winter, Spring, or Fall) from the month on the form
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store function
 */
export const computeTermFromStartDate = ({ get, store }) => {
  const selectedMonth = +get(state.form.month);

  if (selectedMonth) {
    let term;
    const termsByMonth = {
      fall: [9, 10, 11, 12],
      spring: [4, 5, 6],
      winter: [1, 2, 3],
    };

    if (termsByMonth.winter.includes(selectedMonth)) {
      term = 'Winter';
    } else if (termsByMonth.spring.includes(selectedMonth)) {
      term = 'Spring';
    } else if (termsByMonth.fall.includes(selectedMonth)) {
      term = 'Fall';
    }

    if (term) store.set(state.form.term, term);
  }
};
