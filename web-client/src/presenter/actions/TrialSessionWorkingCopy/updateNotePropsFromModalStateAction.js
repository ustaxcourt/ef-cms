import { state } from 'cerebral';

/**
 * update props from modal state to pass to other actions
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new props from modal state
 */
export const updateNotePropsFromModalStateAction = ({ get }) => {
  const caseId = get(state.modal.caseId);
  const notes = get(state.modal.notes);
  const trialSessionId = get(state.trialSession.trialSessionId);

  return { caseId, notes, trialSessionId };
};
