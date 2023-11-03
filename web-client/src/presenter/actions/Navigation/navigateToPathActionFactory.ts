export const navigateToPathActionFactory =
  (path: string) =>
  async ({ router }: ActionProps): Promise<void> => {
    await router.route(path);
  };
