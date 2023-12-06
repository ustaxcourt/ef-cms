import { state } from '@web-client/presenter/app.cerebral';

export const navigateToPrintPaperTrialNoticesAction = async ({
  get,
  props,
  router,
}: ActionProps<{ fileId: string }>) => {
  const trialSessionId = get(state.trialSession.trialSessionId);
  await router.route(
    `/trial-session-detail/${trialSessionId}/print-paper-trial-notices/${props.fileId}`,
  );
};
