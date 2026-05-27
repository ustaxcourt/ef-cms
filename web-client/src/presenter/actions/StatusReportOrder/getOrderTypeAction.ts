import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import {
  GRANT_DENY_MOTION_OPTIONS,
  MOTION_ORDER_RESPONSE_OPTIONS,
} from '@shared/business/entities/EntityConstants';

export const getOrderTypeAction = ({ get, path }) => {
  const documentToEdit = get(state.documentToEdit);

  const docketEntryDescription = get(state.form.docketEntryDescription);

  const isGrantDenyMotion =
    !isEmpty(documentToEdit) &&
    documentToEdit.draftOrderState?.orderType ===
      GRANT_DENY_MOTION_OPTIONS.orderType;

  const isStatusReportOrder =
    !isGrantDenyMotion &&
    ((!isEmpty(documentToEdit) &&
      !!documentToEdit.draftOrderState.docketEntryDescription) ||
      !!docketEntryDescription);

  const isMotionResponseOrder =
    !isEmpty(documentToEdit) &&
    documentToEdit.draftOrderState?.orderType ===
      MOTION_ORDER_RESPONSE_OPTIONS.orderType;

  const permissions = get(state.permissions);

  if (isGrantDenyMotion && permissions.STAMP_MOTION) {
    return path.isGrantDenyMotion();
  }

  if (isStatusReportOrder && permissions.STATUS_REPORT_ORDER) {
    return path.isStatusReportOrder();
  }

  if (isMotionResponseOrder && permissions.MOTION_ORDER_RESPONSE) {
    return path.isMotionOrderResponse();
  }
  return path.isStandardOrder();
};
