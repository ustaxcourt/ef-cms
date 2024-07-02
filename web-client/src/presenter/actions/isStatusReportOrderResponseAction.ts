import { state } from '@web-client/presenter/app.cerebral';

export const isStatusReportOrderResponseAction = ({ get, path }) => {
  const documentToEdit = get(state.documentToEdit);
  const isStatusReportOrderResponse =
    !!documentToEdit.draftOrderState.docketEntryDescription;

  if (isStatusReportOrderResponse) {
    return path.isStatusReportOrderResponse();
  }

  return path.isNotStatusReportOrderResponse();
};
