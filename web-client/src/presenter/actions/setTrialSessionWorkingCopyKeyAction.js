import { state } from 'cerebral';

/**
 * sets the state.trialSessionWorkingCopy
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.users
 * @param {object} providers.props the cerebral props object used for getting the props.users
 */
export const setTrialSessionWorkingCopyKeyAction = ({ props, store }) => {
  store.set(state.trialSessionWorkingCopy[props.key], props.value);
};
