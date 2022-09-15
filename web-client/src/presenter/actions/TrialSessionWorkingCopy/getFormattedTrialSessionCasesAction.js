import { state } from 'cerebral';

/**
 * getFormattedTrialSessionCasesAction
 *
 * @param {object} providers.get the cerebral get function
 * @returns {Object} formattedCases
 */

export const getFormattedTrialSessionCasesAction = ({ get }) => {
  const formattedCases =
    get(state.trialSessionWorkingCopyHelper).formattedCases || [];
  return { formattedCases };
};
