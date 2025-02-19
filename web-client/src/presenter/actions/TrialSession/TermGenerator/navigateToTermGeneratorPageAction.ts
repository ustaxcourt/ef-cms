export const navigateToTermGeneratorPageAction = async ({
  router,
}: ActionProps) => {
  await router.route('/trial-session/term-generator');
};
