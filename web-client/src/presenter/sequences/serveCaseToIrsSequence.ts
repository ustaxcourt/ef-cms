import { clearModalAction } from '../actions/clearModalAction';
import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { getServeToIrsAlertSuccessAction } from '../actions/StartCaseInternal/getServeToIrsAlertSuccessAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';
import { serveCaseToIrsAction } from '../actions/StartCaseInternal/serveCaseToIrsAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const serveCaseToIrsSequence = [
  clearPdfPreviewUrlAction,
  showProgressSequenceDecorator([
    serveCaseToIrsAction,
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
  ]),
];
