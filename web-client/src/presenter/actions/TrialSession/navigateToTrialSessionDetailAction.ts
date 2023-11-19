import { state } from '@web-client/presenter/app.cerebral';

export const navigateToTrialSessionDetailAction = async ({
  get,
  router,
}: ActionProps) => {
  const trialSessionId = get(state.trialSession.trialSessionId);
  await router.route(`/trial-session-detail/${trialSessionId}`);
};
