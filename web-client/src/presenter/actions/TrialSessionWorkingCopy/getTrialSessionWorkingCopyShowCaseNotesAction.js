import { state } from 'cerebral';

/**
 * getTrialSessionWorkingCopyShowCaseNotesAction
 *
 * @param {object} providers.get the cerebral get function
 * @returns {Object} showCaseNotes
 */

export const getTrialSessionWorkingCopyShowCaseNotesAction = ({ get }) => {
  const showCaseNotes = get(state.modal.showCaseNotes);
  return { showCaseNotes };
};
