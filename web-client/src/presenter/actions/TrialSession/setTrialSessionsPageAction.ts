import { state } from '@web-client/presenter/app.cerebral';

export const setTrialSessionsPageAction = ({ props, store }: ActionProps) => {
  store.set(state.trialSessionsPage.trialSessions, props.trialSessions);
};
