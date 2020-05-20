import { state } from 'cerebral';

/**
 * computes the irs notice date from a month, day and year value
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 * @returns {object} props object
 */
export const computeIrsNoticeDateAction = ({
  applicationContext,
  get,
  store,
}) => {
  let irsNoticeDate = null;
  const form = get(state.form);

  if (
    applicationContext
      .getUtilities()
      .isValidDateString(`${form.irsMonth}-${form.irsDay}-${form.irsYear}`)
  ) {
    irsNoticeDate = applicationContext
      .getUtilities()
      .createISODateStringFromObject({
        day: form.irsDay,
        month: form.irsMonth,
        year: form.irsYear,
      });
  }

  store.set(state.form.irsNoticeDate, irsNoticeDate);

  return { computedIrsNoticeDate: irsNoticeDate };
};
