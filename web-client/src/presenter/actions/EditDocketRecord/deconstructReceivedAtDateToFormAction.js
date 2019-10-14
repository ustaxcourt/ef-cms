import { state } from 'cerebral';

/**
 * takes a date from a docket entry and create seperate form inputs
 *
 * @param {object} providers the providers object
 * @param {Function} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store used for setting the state.form
 */
export const deconstructReceivedAtDateToFormAction = async ({
  applicationContext,
  props,
  store,
}) => {
  const { docketEntry } = props;

  if (docketEntry.receivedAt) {
    const receivedAt = applicationContext
      .getUtilities()
      .prepareDateFromString(docketEntry.receivedAt);

    if (
      receivedAt &&
      receivedAt.toDate() instanceof Date &&
      receivedAt.isValid()
    ) {
      store.set(state.form.dateReceivedMonth, receivedAt.format('M'));
      store.set(state.form.dateReceivedDay, receivedAt.format('D'));
      store.set(state.form.dateReceivedYear, receivedAt.format('YYYY'));
    }
  }
};
