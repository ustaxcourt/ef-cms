import { state } from 'cerebral';

/**
 * Used for getting the formatted search params.
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting formattedSearchParams
 * @returns {object.caseId} caseId
 */
export const formatSearchParamsAction = ({ get }) => {
  const formattedCaseId = get(state.formattedSearchParams);
  return { caseId: formattedCaseId };
};
