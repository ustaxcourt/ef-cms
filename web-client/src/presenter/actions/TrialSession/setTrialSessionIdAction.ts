import { state } from '@web-client/presenter/app.cerebral';

export const setTrialSessionIdAction = ({ props, store }: ActionProps) => {
  store.set(state.trialSession.trialSessionId, props.trialSessionId);
};
