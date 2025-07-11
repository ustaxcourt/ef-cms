import { state } from '@web-client/presenter/app.cerebral';

export const setTrialSessionIdFromCaseDetailAction = ({ props, get }: ActionProps) => {
  console.log('inside settrialsessionid: ', get(state.caseDetail))
  const trialSessionId = get(state.caseDetail.trialSessionId);
  return { ...props, trialSessionId };
};
