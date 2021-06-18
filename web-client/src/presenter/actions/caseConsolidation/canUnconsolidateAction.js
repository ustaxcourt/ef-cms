import { state } from 'cerebral';

/**
 * check to see if we can unconsolidate cases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path
 * @returns {object} the path to take next
 */
export const canUnconsolidateAction = async ({ get, path }) => {
  const casesToRemove = get(state.modal.casesToRemove) || {};
  const docketNumbersToRemove = Object.entries(casesToRemove)
    .filter(([, shouldRemove]) => shouldRemove)
    .map(([docketNumber]) => docketNumber);

  if (docketNumbersToRemove.length === 0) {
    return path.error({
      error: 'Select a case',
    });
  }
  return path.success();
};
