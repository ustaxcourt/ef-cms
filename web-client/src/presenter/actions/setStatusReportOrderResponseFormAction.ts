import { state } from '@web-client/presenter/app.cerebral';

export const setStatusReportOrderResponseFormAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(
    state.statusReportOrderResponse.statusReportFilingDate,
    props.statusReportFilingDate,
  );
  store.set(
    state.statusReportOrderResponse.statusReportIndex,
    props.statusReportIndex,
  );
};
