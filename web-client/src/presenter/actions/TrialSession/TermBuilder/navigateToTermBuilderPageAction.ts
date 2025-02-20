export const navigateToTermBuilderPageAction = async ({
  router,
}: ActionProps) => {
  await router.route('/trial-session/term-builder');
};
