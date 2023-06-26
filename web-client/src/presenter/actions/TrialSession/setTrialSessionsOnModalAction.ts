import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.modal.trialSessions
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.trialSessions
 * @param {object} providers.store the cerebral store used for setting the state.modal.trialSessions
 */
export const setTrialSessionsOnModalAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.modal.trialSessions, props.trialSessions);
};
