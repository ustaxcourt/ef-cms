import { state } from 'cerebral';

/**
 * Used for getting the formatted search params.
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting formattedSearchParams
 */
export default ({ get }) => {
  const formattedCaseId = get(state.formattedSearchParams);
  return { caseId: formattedCaseId };
};
