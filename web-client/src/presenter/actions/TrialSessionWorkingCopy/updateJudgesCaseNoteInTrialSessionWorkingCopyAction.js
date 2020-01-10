import { set } from 'lodash';
import { state } from 'cerebral';

/**
 * update props from modal state to pass to other actions
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const updateJudgesCaseNoteInTrialSessionWorkingCopyAction = ({
  get,
  props,
  store,
}) => {
  const workingCopy = get(state.trialSessionWorkingCopy);

  set(workingCopy, ['caseMetadata', props.docketNumber, 'notes'], props.notes);

  store.set(state.trialSessionWorkingCopy, workingCopy);
};
