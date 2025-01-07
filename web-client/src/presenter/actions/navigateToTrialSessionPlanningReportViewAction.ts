import { state } from '@web-client/presenter/app.cerebral';

export const navigateToTrialSessionPlanningReportViewAction = async ({
  get,
  router,
}: ActionProps) => {
  const { term, year } = get(state.modal);
  await router.route(`/trial-session-planning-report/${term}/${year}`);
};
