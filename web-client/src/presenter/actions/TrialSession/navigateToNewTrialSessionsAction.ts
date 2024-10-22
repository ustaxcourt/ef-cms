export const navigateToNewTrialSessionsAction = async ({
  router,
}: ActionProps) => {
  await router.route('/trial-sessions?currentTab=new');
};
