export const navigateToTrialSessionsAction = async ({
  router,
}: ActionProps) => {
  await router.route('/trial-sessions');
};
