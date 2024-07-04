import { state } from '@web-client/presenter/app.cerebral';

export const isStatusReportOrderResponseAction = ({ get, path }) => {
  const documentToEdit = get(state.documentToEdit);
  const isStatusReportOrderResponse =
    !!documentToEdit.draftOrderState.docketEntryDescription;

  const permissions = get(state.permissions);

  if (isStatusReportOrderResponse && permissions.ORDER_RESPONSE) {
    return path.isStatusReportOrderResponse();
  }

  return path.isNotStatusReportOrderResponse();
};
