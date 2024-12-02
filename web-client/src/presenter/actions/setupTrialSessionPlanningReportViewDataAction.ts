import { state } from '@web-client/presenter/app.cerebral';

export const setupTrialSessionPlanningReportViewDataAction = ({
  props,
  store,
}: ActionProps<{ trialTerm: string; trialYear: number }>) => {
  const { trialTerm, trialYear } = props;
  store.set(state.trialSessionPlanningReportData.trialTerm, trialTerm);
  store.set(state.trialSessionPlanningReportData.trialYear, trialYear);
};
