import { state } from '@web-client/presenter/app.cerebral';

export const setupTrialSessionPlanningReportViewDataAction = ({
  props,
  store,
}: ActionProps<{ term: string; year: number }>) => {
  const { term, year } = props;
  store.set(state.trialSessionPlanningReportData.trialTerm, term);
  store.set(state.trialSessionPlanningReportData.trialYear, year);
};
