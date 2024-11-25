import { state } from '@web-client/presenter/app.cerebral';

function formatTerm(trialTerm: string): string {
  if (!trialTerm) return '';
  const lowercased = trialTerm.toLowerCase().trim();
  return lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
}

export const setupTrialSessionPlanningReportViewDataAction = ({
  props,
  store,
}: ActionProps<{ trialTerm: string; trialYear: number }>) => {
  const { trialTerm, trialYear } = props;
  store.set(
    state.trialSessionPlanningReportData.trialTerm,
    formatTerm(trialTerm),
  );
  store.set(state.trialSessionPlanningReportData.trialYear, trialYear);
};
