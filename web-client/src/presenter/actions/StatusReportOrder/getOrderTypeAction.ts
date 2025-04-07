import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { MOTION_ORDER_RESPONSE_OPTIONS } from '@shared/business/entities/EntityConstants';

export const getOrderTypeAction = ({ get, path }) => {
  const documentToEdit = get(state.documentToEdit);

  const docketEntryDescription = get(state.form.docketEntryDescription);

  const isStatusReportOrder =
    (!isEmpty(documentToEdit) &&
      !!documentToEdit.draftOrderState.docketEntryDescription) ||
    !!docketEntryDescription;

  const isMotionResponseOrder =
    !isEmpty(documentToEdit) &&
    documentToEdit.draftOrderState?.orderType ===
      MOTION_ORDER_RESPONSE_OPTIONS.orderType;

  const permissions = get(state.permissions);

  if (isStatusReportOrder && permissions.STATUS_REPORT_ORDER) {
    return path.isStatusReportOrder();
  }

  if (isMotionResponseOrder && permissions.MOTION_ORDER_RESPONSE) {
    return path.isMotionOrderResponse();
  }
  return path.isStandardOrder();
};
