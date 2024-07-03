import { checkDocumentTypeAction } from '@web-client/presenter/actions/checkDocumentTypeAction';
import { isStatusReportOrderResponseAction } from '@web-client/presenter/actions/isStatusReportOrderResponseAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { navigateToStatusReportOrderResponseAction } from '@web-client/presenter/actions/navigateToStatusReportOrderResponseAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setEditStatusReportOrderResponseFormAction } from '@web-client/presenter/actions/setEditStatusReportOrderResponseFormAction';
import { statusReportOrderResponsePdfPreviewSequence } from '@web-client/presenter/sequences/statusReportOrderResponsePdfPreviewSequence';

export const draftDocumentEditNotSignedSequence = [
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
];
