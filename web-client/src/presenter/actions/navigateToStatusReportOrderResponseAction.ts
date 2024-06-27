import { state } from '@web-client/presenter/app.cerebral';

export const navigateToStatusReportOrderResponseAction = async ({
  props,
  router,
  store,
}: ActionProps) => {
  console.log(props);
  store.set(
    state.statusReportOrderResponse.statusReportFilingDate,
    props.statusReportFilingDate,
  );
  store.set(
    state.statusReportOrderResponse.statusReportIndex,
    props.statusReportIndex,
  );

  await router.route(props.url);
};
