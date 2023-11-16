export const navigateToPathAction = async ({
  props,
  router,
}: ActionProps): Promise<void> => {
  const { path } = props;
  await router.route(path || '/');
};
