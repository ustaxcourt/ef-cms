import { state } from 'cerebral';

/**
 * computes the date from a month, day and year value
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.get the cerebral get function
 * @returns {object} props object
 */
export const computeReceivedAtDateAction = ({
  applicationContext,
  get,
  store,
}) => {
  let receivedAt = null;
  const form = get(state.form);

  if (
    applicationContext
      .getUtilities()
      .isValidDateString(
        `${form.receivedAtMonth}-${form.receivedAtDay}-${form.receivedAtYear}`,
      )
  ) {
    receivedAt = applicationContext
      .getUtilities()
      .createISODateStringFromObject({
        day: form.receivedAtDay,
        month: form.receivedAtMonth,
        year: form.receivedAtYear,
      });
  }

  store.set(state.form.receivedAt, receivedAt);

  return { receivedAt };
};
