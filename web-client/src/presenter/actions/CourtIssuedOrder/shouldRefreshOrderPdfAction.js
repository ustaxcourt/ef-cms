import { state } from 'cerebral';

/**
 * returns path.yes if the currentTab is preview to refresh the order pdf; returns no otherwise
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path object
 * @returns {Function} the path to take in the sequence
 */
export const shouldRefreshOrderPdfAction = ({ get, path }) => {
  const currentTab = get(state.createOrderTab);

  if (currentTab === 'preview') {
    return path.yes();
  }
  return path.no();
};
