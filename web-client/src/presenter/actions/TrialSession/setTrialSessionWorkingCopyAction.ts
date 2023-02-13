import { state } from 'cerebral';

/**
 * sets the state.trialSessionWorkingCopy
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.trialSessionWorkingCopy
 * @param {object} providers.store the cerebral store used for setting the state.trialSessionWorkingCopy
 */
export const setTrialSessionWorkingCopyAction = ({ props, store }) => {
  store.set(state.trialSessionWorkingCopy, props.trialSessionWorkingCopy);
};
