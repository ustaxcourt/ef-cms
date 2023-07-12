import { state } from 'cerebral';

/**
 * computes the filingDate from a month, day and year value and add as prop
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.get the cerebral get function
 * @returns {void}
 */
export const computeFilingFormDateAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  let filingDate = null;
  const month = get(state.form.filingDateMonth);
  const day = get(state.form.filingDateDay);
  const year = get(state.form.filingDateYear);

  if (month && day && year) {
    filingDate = applicationContext
      .getUtilities()
      .computeDate({ day, month, year });

    store.set(state.form.filingDate, filingDate);
  }
};
