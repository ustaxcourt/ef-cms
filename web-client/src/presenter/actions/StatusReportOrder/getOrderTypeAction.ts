import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const getOrderTypeAction = ({ get, path }) => {
  const documentToEdit = get(state.documentToEdit);
  console.log('documentToEdit', documentToEdit);
  const docketEntryDescription = get(state.form.docketEntryDescription);

  const isStatusReportOrder =
    (!isEmpty(documentToEdit) &&
      !!documentToEdit.draftOrderState.docketEntryDescription) ||
    !!docketEntryDescription;

  const isMotionResponseOrder =
    !isEmpty(documentToEdit) &&
    documentToEdit.draftOrderState?.orderType === 'motionOrderResponse';

  const permissions = get(state.permissions);

  if (isStatusReportOrder && permissions.STATUS_REPORT_ORDER) {
    return path.isStatusReportOrder();
  }

  if (isMotionResponseOrder && permissions.MOTION_ORDER_RESPONSE) {
    return path.isMotionOrderResponse();
  }
  return path.isStandardOrder();
};
