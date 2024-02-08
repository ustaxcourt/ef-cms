import { clearModalAction } from '@web-client/presenter/actions/clearModalAction';
import { clearModalStateAction } from '@web-client/presenter/actions/clearModalStateAction';
import { followRedirectAction } from '@web-client/presenter/actions/followRedirectAction';
import { getServeToIrsAlertSuccessAction } from '@web-client/presenter/actions/StartCaseInternal/getServeToIrsAlertSuccessAction';
import { navigateToDocumentQCAction } from '@web-client/presenter/actions/navigateToDocumentQCAction';
import { serveToIrsCompleteAction } from '@web-client/presenter/actions/CaseConfirmation/serveToIrsCompleteAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { setPdfPreviewUrlSequence } from '@web-client/presenter/sequences/setPdfPreviewUrlSequence';
import { setSaveAlertsForNavigationAction } from '@web-client/presenter/actions/setSaveAlertsForNavigationAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';

export const serveToIrsCompleteSequence = [
  unsetWaitingForResponseAction,
  clearModalStateAction,
  serveToIrsCompleteAction,
  {
    electronic: [
      clearModalAction,
      getServeToIrsAlertSuccessAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      followRedirectAction,
      {
        default: [navigateToDocumentQCAction],
        success: [],
      },
    ],
    paper: [
      clearModalAction,
      setPdfPreviewUrlSequence,
      setupCurrentPageAction('PrintPaperPetitionReceipt'),
    ],
  },
  setAlertSuccessAction,
];
