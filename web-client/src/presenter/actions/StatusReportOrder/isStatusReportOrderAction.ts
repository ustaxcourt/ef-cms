import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const isStatusReportOrderAction = ({ get, path }) => {
  const documentToEdit = get(state.documentToEdit);
  const docketEntryDescription = get(state.form.docketEntryDescription);
  const isStatusReportOrder =
    (!isEmpty(documentToEdit) &&
      !!documentToEdit.draftOrderState.docketEntryDescription) ||
    !!docketEntryDescription;

  const permissions = get(state.permissions);

  if (isStatusReportOrder && permissions.STATUS_REPORT_ORDER) {
    return path.isStatusReportOrder();
  }

  return path.isNotStatusReportOrder();
};
