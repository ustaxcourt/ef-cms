import { state } from 'cerebral';

/**
 * check if case is a consolidated case and returns path
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the paths for next execution
 * @returns {object} the path to execute next
 */
export const isConsolidatedCaseAction = async ({ get, path }) => {
  const leadCaseId = get(state.caseDetail.leadCaseId);

  if (leadCaseId) {
    return path.yes();
  } else {
    return path.no();
  }
};
