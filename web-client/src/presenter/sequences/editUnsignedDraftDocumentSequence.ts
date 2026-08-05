import { checkDocumentTypeAction } from '@web-client/presenter/actions/checkDocumentTypeAction';
import { getOrderTypeAction } from '@web-client/presenter/actions/StatusReportOrder/getOrderTypeAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setEditGrantDenyMotionFormAction } from '@web-client/presenter/actions/GrantDenyMotion/setEditGrantDenyMotionFormAction';
import { setEditStatusReportOrderFormAction } from '@web-client/presenter/actions/StatusReportOrder/setEditStatusReportOrderFormAction';
import { setEditMotionOrderResponseFormAction } from '@web-client/presenter/actions/MotionOrderResponse/setEditMotionOrderResponseFormAction';

export const editUnsignedDraftDocumentSequence = [
  checkDocumentTypeAction,
  {
    documentTypeMiscellaneous: [navigateToPathAction],
    documentTypeOrder: [
      setDocumentToEditAction,
      getOrderTypeAction,
      {
        isGrantDenyMotion: [
          setEditGrantDenyMotionFormAction,
          navigateToPathAction,
        ],
        isMotionOrderResponse: [
          setEditMotionOrderResponseFormAction,
          navigateToPathAction,
        ],
        isStandardOrder: [navigateToPathAction],
        isStatusReportOrder: [
          setEditStatusReportOrderFormAction,
          navigateToPathAction,
        ],
      },
    ],
  },
] as unknown as (props: {
  caseDetail: RawCase;
  docketEntryIdToEdit: string;
  documentType?: string;
  parentMessageId?: string;
}) => void;
