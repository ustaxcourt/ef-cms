import { state } from 'cerebral';

/**
 * sets the state.trialSession
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.trialSession
 * @param {object} providers.store the cerebral store used for setting the state.trialSession
 */
export const setTrialSessionDetailsAction = ({ store, props }) => {
  store.set(state.trialSession, props.trialSession);
};
