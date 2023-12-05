import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { state } from '@web-client/presenter/app.cerebral';

export const updateTrialSessionInTrialSessionsAction = ({
  get,
  props,
  store,
}: ActionProps<{
  trialSession: RawTrialSession;
}>) => {
  const { trialSession } = props;
  const trialSessions = get(state.trialSessions);

  trialSessions.forEach((_trialSession, idx) => {
    if (_trialSession.trialSessionId === trialSession.trialSessionId) {
      trialSessions[idx] = trialSession;
    }
  });

  store.set(state.trialSessions, trialSessions);
};
