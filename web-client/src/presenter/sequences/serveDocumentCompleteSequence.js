import { clearModalAction } from '../actions/clearModalAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { generateCoversheetAction } from '../actions/DocketEntry/generateCoversheetAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { isCoversheetNeededAction } from '../actions/DocketEntry/isCoversheetNeededAction';
import { isPrintPreviewPreparedAction } from '../actions/CourtIssuedOrder/isPrintPreviewPreparedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { navigateToPrintPaperServiceAction } from '../actions/navigateToPrintPaperServiceAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setDocumentToDisplayFromDocumentIdAction } from '../actions/setDocumentToDisplayFromDocumentIdAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const serveDocumentCompleteSequence = [
  clearModalAction,
  isCoversheetNeededAction,
  {
    no: [],
    yes: [generateCoversheetAction],
  },
  unsetWaitingForResponseAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  setPdfPreviewUrlAction,
  isPrintPreviewPreparedAction,
  {
    no: [
      getCaseAction,
      setCaseAction,
      getConsolidatedCasesByCaseAction,
      setConsolidatedCasesForCaseAction,
      followRedirectAction,
      {
        default: [navigateToCaseDetailAction],
        success: [setDocumentToDisplayFromDocumentIdAction],
      },
    ],
    yes: [navigateToPrintPaperServiceAction],
  },
];
