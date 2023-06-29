import { state } from '@web-client/presenter/app.cerebral';

/**
 * update props from modal state to pass to other actions
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const updateSessionNoteInTrialSessionWorkingCopyAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.trialSessionWorkingCopy.sessionNotes, props.notes);
};
