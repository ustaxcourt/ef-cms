import { state } from 'cerebral';

/**
 * getTrialSessionWorkingCopyCaseNotesFlagAction
 *
 * @param {object} providers.get the cerebral get function
 * @returns {Object} caseNotesFlag
 */

export const getTrialSessionWorkingCopyCaseNotesFlagAction = ({ get }) => {
  const caseNotesFlag = get(state.modal.caseNotesFlag);
  return { caseNotesFlag };
};
