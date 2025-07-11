import { state } from '@web-client/presenter/app.cerebral';

export const setTrialSessionIdFromCaseDetailAction = ({ props, get }: ActionProps) => {
  const trialSessionId = get(state.caseDetail.trialSessionId);
  return { ...props, trialSessionId };
};
