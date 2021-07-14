import { state } from 'cerebral';

/**
 * returns yes if we should refresh the case after generating the notice pdf
 *
 * @param {object} providers the providers object
 * @param {Function} providers.path the cerebral path method
 * @param {Function} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @returns {object} the path yes or no depending on if the case needs to be refreshed
 */
export const shouldRefreshCaseAction = ({ get, path, props }) => {
  const docketNumber = props.docketNumber || get(state.caseDetail.docketNumber);
  if (docketNumber) {
    return path.yes();
  } else {
    return path.no();
  }
};
