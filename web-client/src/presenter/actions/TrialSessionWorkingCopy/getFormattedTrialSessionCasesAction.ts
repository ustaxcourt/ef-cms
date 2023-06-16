import { state } from '@web-client/presenter/app.cerebral';

/**
 * getFormattedTrialSessionCasesAction
 * @param {object} providers.get the cerebral get function
 * @returns {Object} formattedCases
 */

export const getFormattedTrialSessionCasesAction = ({ get }: ActionProps) => {
  const formattedCases =
    get(state.trialSessionWorkingCopyHelper).formattedCases || [];
  return { formattedCases };
};
