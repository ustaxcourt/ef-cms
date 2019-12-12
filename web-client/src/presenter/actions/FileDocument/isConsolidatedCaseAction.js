import { state } from 'cerebral';

/**
 * checks if the case is part of a consolidated set by way of the leadCaseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the application context
 * @param {object} providers.path the next object in the path
 * @returns {object} the next path based on if validation was successful or error
 */

export const isConsolidatedCaseAction = ({ get, path }) => {
  const { leadCaseId } = get(state.caseDetail);
  if (leadCaseId) {
    return path.yes();
  } else {
    return path.no();
  }
};
