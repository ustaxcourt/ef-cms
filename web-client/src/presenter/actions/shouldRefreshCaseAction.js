import { state } from 'cerebral';

/**
 * returns yes if we should refresh the case after generating the notice pdf
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.path the cerebral path method
 * @param {Function} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @returns {object} the list of section work items
 */
export const shouldRefreshCaseAction = async ({ get, path, props }) => {
  const docketNumber = props.docketNumber || get(state.caseDetail.docketNumber);
  if (docketNumber) {
    return path.yes();
  } else {
    return path.no();
  }
};
