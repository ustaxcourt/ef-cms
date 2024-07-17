import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const isStatusReportOrderResponseAction = ({ get, path }) => {
  const documentToEdit = get(state.documentToEdit);
  const docketEntryDescription = get(state.form.docketEntryDescription);
  const isStatusReportOrderResponse =
    (!isEmpty(documentToEdit) &&
      !!documentToEdit.draftOrderState.docketEntryDescription) ||
    !!docketEntryDescription;

  const permissions = get(state.permissions);

  if (isStatusReportOrderResponse && permissions.ORDER_RESPONSE) {
    return path.isStatusReportOrderResponse();
  }

  return path.isNotStatusReportOrderResponse();
};
