import { state } from 'cerebral';

/**
 * updates trial session in state.trialSessions
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.store the cerebral store for setting state
 * @param {object} providers.props the cerebral props pass through the action
 * @returns {void}
 */
export const updateTrialSessionInTrialSessionsAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { trialSession } = props;
  const trialSessions = get(state.trialSessions);

  trialSessions.forEach((_trialSession, idx) => {
    if (_trialSession.trialSessionId === trialSession.trialSessionId) {
      trialSessions[idx] = trialSession;
    }
  });

  store.set(state.trialSessions, trialSessions);
};
