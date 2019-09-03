import { state } from 'cerebral';

/**
 * set the default sort for the working copy table
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.get the cerebral get function
 */
export const setDefaultWorkingCopyValuesAction = ({ get, store }) => {
  const sort = get(state.trialSessionWorkingCopy.sort);
  const sortOrder = get(state.trialSessionWorkingCopy.sortOrder);
  const filters = get(state.trialSessionWorkingCopy.filters);

  if (!sort) {
    store.set(state.trialSessionWorkingCopy.sort, 'docket');
  }

  if (!sortOrder) {
    store.set(state.trialSessionWorkingCopy.sortOrder, 'asc');
  }

  if (!filters) {
    store.set(state.trialSessionWorkingCopy.filters, {
      aBasisReached: true,
      continued: true,
      dismissed: true,
      recall: true,
      rule122: true,
      setForTrial: true,
      settled: true,
      showAll: true,
      statusUnassigned: true,
      takenUnderAdvisement: true,
    });
  }
};
