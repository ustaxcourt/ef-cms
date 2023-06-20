import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.trialSessions
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.trialSessions
 * @param {object} providers.store the cerebral store used for setting the state.trialSessions
 */
export const setTrialSessionsAction = ({ props, store }: ActionProps) => {
  store.set(state.trialSessions, props.trialSessions);
};
