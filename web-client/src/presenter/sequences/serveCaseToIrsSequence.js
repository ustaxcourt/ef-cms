import { clearModalAction } from '../actions/clearModalAction';
import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { getServeToIrsAlertSuccessAction } from '../actions/StartCaseInternal/getServeToIrsAlertSuccessAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';
import { navigateToPrintPaperPetitionReceiptAction } from '../actions/navigateToPrintPaperPetitionReceiptAction';
import { serveCaseToIrsAction } from '../actions/StartCaseInternal/serveCaseToIrsAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { shouldNavigateAction } from '../actions/shouldNavigateAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

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
        shouldNavigateAction,
        {
          no: [],
          yes: [navigateToDocumentQCAction],
        },
      ],
      paper: [
        clearModalAction,
        setPdfPreviewUrlSequence,
        navigateToPrintPaperPetitionReceiptAction,
      ],
    },
  ]),
];
