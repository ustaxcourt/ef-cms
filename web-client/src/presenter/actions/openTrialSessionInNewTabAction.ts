import { state } from '@web-client/presenter/app.cerebral';

export const openTrialSessionInNewTabAction = ({ get, props }: ActionProps) => {
  const trialSessionId =
    get(state.lastCreatedTrialSessionId) || props.trialSession;

  window.open(`/trial-session-detail/${trialSessionId}`, '_blank');
};
