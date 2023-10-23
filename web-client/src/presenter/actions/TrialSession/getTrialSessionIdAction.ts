import { state } from '@web-client/presenter/app.cerebral';

export const getTrialSessionIdAction = ({
  get,
}: ActionProps): { trialSessionId: string } => {
  return { trialSessionId: get(state.trialSessionId) };
};
