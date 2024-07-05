import { checkDocumentTypeAction } from '@web-client/presenter/actions/checkDocumentTypeAction';
import { isStatusReportOrderResponseAction } from '@web-client/presenter/actions/StatusReportOrderResponse/isStatusReportOrderResponseAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { navigateToStatusReportOrderResponseAction } from '@web-client/presenter/actions/StatusReportOrderResponse/navigateToStatusReportOrderResponseAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setEditStatusReportOrderResponseFormAction } from '@web-client/presenter/actions/StatusReportOrderResponse/setEditStatusReportOrderResponseFormAction';
import { statusReportOrderResponsePdfPreviewSequence } from '@web-client/presenter/sequences/StatusReportOrderResponse/statusReportOrderResponsePdfPreviewSequence';

export const editUnsignedDraftDocumentSequence = [
  checkDocumentTypeAction,
  {
    documentTypeMiscellaneous: [navigateToPathAction],
    documentTypeOrder: [
      setDocumentToEditAction,
      isStatusReportOrderResponseAction,
      {
        isNotStatusReportOrderResponse: [navigateToPathAction],
        isStatusReportOrderResponse: [
          setEditStatusReportOrderResponseFormAction,
          navigateToStatusReportOrderResponseAction,
          statusReportOrderResponsePdfPreviewSequence,
        ],
      },
    ],
  },
] as unknown as (props: {
  caseDetail: RawCase;
  docketEntryIdToEdit: string;
  documentType: string;
}) => void;
