import { state } from 'cerebral';

/**
 * computes the irs notice date from a month, day and year value
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.get the cerebral get function
 * @returns {object} props object
 */
export const computeIrsNoticeDateAction = ({ get, store }) => {
  let formDate = null;
  const formMonth = get(state.form.irsMonth);
  const formDay = get(state.form.irsDay);
  const formYear = get(state.form.irsYear);

  if (formMonth || formDay || formYear) {
    formDate = `${formYear}-${formMonth}-${formDay}`;

    formDate = formDate
      .split('-')
      .map(segment => segment.padStart(2, '0'))
      .join('-');
  }

  store.set(state.form.irsNoticeDate, formDate);

  return { computedIrsNoticeDate: formDate };
};
