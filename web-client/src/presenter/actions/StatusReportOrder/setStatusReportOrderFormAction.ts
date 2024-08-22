import { state } from '@web-client/presenter/app.cerebral';

export const setStatusReportOrderFormAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const documentToEdit = get(state.documentToEdit);
  const statusReportFilingDate =
    props.statusReportFilingDate ||
    documentToEdit.draftOrderState.statusReportFilingDate;

  const statusReportIndex =
    props.statusReportIndex || documentToEdit.draftOrderState.statusReportIndex;

  store.set(
    state.statusReportOrder.statusReportFilingDate,
    statusReportFilingDate,
  );

  store.set(state.statusReportOrder.statusReportIndex, statusReportIndex);
};
