import { state } from 'cerebral';

/**
 * sets the state.trialSessionId
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.trialSessionId
 * @param {object} providers.store the cerebral store used for setting the state.trialSessionId
 */
export const setTrialSessionIdAction = ({ props, store }) => {
  store.set(state.trialSessionId, props.trialSessionId);
};
