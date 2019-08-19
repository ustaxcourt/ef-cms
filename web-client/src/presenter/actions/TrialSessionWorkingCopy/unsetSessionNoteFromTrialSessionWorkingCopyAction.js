import { state } from 'cerebral';
import { unset } from 'lodash';

/**
 * update props from modal state to pass to other actions
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const unsetSessionNoteFromTrialSessionWorkingCopyAction = ({
  get,
  store,
}) => {
  const workingCopy = get(state.trialSessionWorkingCopy);

  unset(workingCopy, ['sessionNotes']);

  store.set(state.trialSessionWorkingCopy, workingCopy);
};
