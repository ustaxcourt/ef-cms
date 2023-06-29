import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.trialSession
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.trialSession
 * @param {object} providers.store the cerebral store used for setting the state.trialSession
 */
export const setTrialSessionDetailsAction = ({ props, store }: ActionProps) => {
  store.set(state.trialSession, props.trialSession);
};
