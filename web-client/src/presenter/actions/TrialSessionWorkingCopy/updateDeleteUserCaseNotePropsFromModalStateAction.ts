import { state } from 'cerebral';

/**
 * update props from modal state to pass to other actions
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new props from modal state
 */
export const updateDeleteUserCaseNotePropsFromModalStateAction = ({ get }) => {
  const docketNumber = get(state.modal.docketNumber);
  const trialSessionId = get(state.trialSession.trialSessionId);

  return { docketNumber, trialSessionId };
};
