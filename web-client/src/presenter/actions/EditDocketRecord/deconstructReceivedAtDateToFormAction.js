import { state } from 'cerebral';

/**
 * sets the form's irs notice date and pay gov date based on the caseDetail provided in state.caseDetail
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the state.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.form
 */
export const deconstructReceivedAtDateToFormAction = async ({
  applicationContext,
  props,
  store,
}) => {
  const { docketEntry } = props;

  const receivedAt = applicationContext
    .getUtilities()
    .prepareDateFromString(docketEntry.receivedAt);
  if (
    receivedAt &&
    receivedAt.toDate() instanceof Date &&
    !isNaN(receivedAt.toDate())
  ) {
    store.set(state.form.dateReceivedMonth, receivedAt.format('M'));
    store.set(state.form.dateReceivedDay, receivedAt.format('D'));
    store.set(state.form.dateReceivedYear, receivedAt.format('YYYY'));
  }
};
