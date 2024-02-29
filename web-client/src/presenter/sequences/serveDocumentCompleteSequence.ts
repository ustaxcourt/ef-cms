import { clearModalAction } from '../actions/clearModalAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { generateCoversheetAction } from '../actions/DocketEntry/generateCoversheetAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isCoversheetNeededAction } from '../actions/DocketEntry/isCoversheetNeededAction';
import { isPrintPreviewPreparedAction } from '../actions/CourtIssuedOrder/isPrintPreviewPreparedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { navigateToPrintPaperServiceAction } from '../actions/navigateToPrintPaperServiceAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentToDisplayFromDocumentIdAction } from '../actions/setDocumentToDisplayFromDocumentIdAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const serveDocumentCompleteSequence = [
  clearModalAction,
  isCoversheetNeededAction,
  {
    no: [],
    yes: [generateCoversheetAction], //addcover down adds reupload
    // localGenerate: [generateCoversheetOnClientAction]
    //get cover from backend
    //get original file just uploaded
    //front end append it to document
    //reupload
  },
  unsetWaitingForResponseAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  setPdfPreviewUrlAction,
  isPrintPreviewPreparedAction,
  {
    no: [
      followRedirectAction,
      {
        default: [navigateToCaseDetailAction],
        success: [
          getCaseAction,
          setCaseAction,
          setDocumentToDisplayFromDocumentIdAction,
        ],
      },
    ],
    yes: [navigateToPrintPaperServiceAction],
  },
];
