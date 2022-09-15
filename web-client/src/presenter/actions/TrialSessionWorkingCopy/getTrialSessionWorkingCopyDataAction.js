import { state } from 'cerebral';

/**
 * getTrialSessionWorkingCopyDataAction
 *
 * @param {object} providers.get the cerebral get function
 * @returns {Object} filters, sessionNotes
 */

export const getTrialSessionWorkingCopyDataAction = ({ get }) => {
  const { filters, sessionNotes } = get(state.trialSessionWorkingCopy);
  return { filters, sessionNotes };
};
