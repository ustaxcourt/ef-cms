import { state } from '@web-client/presenter/app.cerebral';

export const navigateToTrialSessionsAction = async ({
  get,
  router,
}: ActionProps) => {
  let route = '/trial-sessions';
  const trialSessionsTab = get(state.currentViewMetadata.tab);

  if (trialSessionsTab) route += `?status=${trialSessionsTab}`;

  await router.route(route);
};
