export const navigateToStatusReportOrderResponseAction = async ({
  props,
  router,
}: ActionProps) => {
  await router.route(props.url);
};
