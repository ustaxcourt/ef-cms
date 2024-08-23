import { checkDocumentTypeAction } from '@web-client/presenter/actions/checkDocumentTypeAction';
import { isStatusReportOrderAction } from '@web-client/presenter/actions/StatusReportOrder/isStatusReportOrderAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setEditStatusReportOrderFormAction } from '@web-client/presenter/actions/StatusReportOrder/setEditStatusReportOrderFormAction';

export const editUnsignedDraftDocumentSequence = [
  checkDocumentTypeAction,
  {
    documentTypeMiscellaneous: [navigateToPathAction],
    documentTypeOrder: [
      setDocumentToEditAction,
      isStatusReportOrderAction,
      {
        isNotStatusReportOrder: [navigateToPathAction],
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
  documentType: string;
  parentMessageId?: string;
}) => void;
