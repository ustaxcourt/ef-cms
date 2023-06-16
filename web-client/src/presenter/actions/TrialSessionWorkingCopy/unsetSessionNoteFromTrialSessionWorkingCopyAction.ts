import { state } from '@web-client/presenter/app.cerebral';

/**
 * unset session note in working copy
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const unsetSessionNoteFromTrialSessionWorkingCopyAction = ({
  store,
}: ActionProps) => {
  store.unset(state.trialSessionWorkingCopy.sessionNotes);
};
