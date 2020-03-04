import { state } from 'cerebral';

/**
 * returns the correct path depending on whether the trial session id is set in the state
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the paths for next execution
 * @returns {object} the path to execute next
 */
export const shouldGetTrialSessionWorkingCopyAction = async ({ get, path }) => {
  const trialSessionId = get(state.caseDetail.trialSessionId);

  if (trialSessionId) {
    return path.yes({ trialSessionId });
  } else {
    return path.no();
  }
};
