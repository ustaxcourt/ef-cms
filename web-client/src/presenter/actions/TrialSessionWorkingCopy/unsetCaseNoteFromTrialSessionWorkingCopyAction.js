import { state } from 'cerebral';
import { unset } from 'lodash';

/**
 * update props from modal state to pass to other actions
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const unsetCaseNoteFromTrialSessionWorkingCopyAction = ({
  get,
  props,
  store,
}) => {
  const workingCopy = get(state.trialSessionWorkingCopy);

  unset(workingCopy, ['caseMetadata', props.docketNumber, 'notes']);

  store.set(state.trialSessionWorkingCopy, workingCopy);
};
