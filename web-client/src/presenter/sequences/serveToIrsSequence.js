import { clearModalAction } from '../actions/clearModalAction';
import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { computeIrsNoticeDateAction } from '../actions/StartCaseInternal/computeIrsNoticeDateAction';
import { createCaseFromPaperAction } from '../actions/createCaseFromPaperAction';
import { getServeToIrsAlertSuccessAction } from '../actions/StartCaseInternal/getServeToIrsAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { navigateToPrintPreviewAction } from '../actions/navigateToPrintPreviewAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { serveCaseToIrsAction } from '../actions/StartCaseInternal/serveCaseToIrsAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setPetitionIdAction } from '../actions/setPetitionIdAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const serveToIrsSequence = [
  computeDateReceivedAction,
  computeIrsNoticeDateAction,
  showProgressSequenceDecorator([
    openFileUploadStatusModalAction,
    createCaseFromPaperAction,
    {
      error: [openFileUploadErrorModal],
      success: [
        setCaseAction,
        setPetitionIdAction,
        setDocumentIdAction,
        closeFileUploadStatusModalAction,
        serveCaseToIrsAction,
        {
          electronic: [
            getServeToIrsAlertSuccessAction,
            setAlertSuccessAction,
            navigateToCaseDetailAction,
          ],
          paper: [
            getServeToIrsAlertSuccessAction,
            setPdfPreviewUrlAction,
            setAlertSuccessAction,
            clearModalAction,
            setSaveAlertsForNavigationAction,
            navigateToPrintPreviewAction,
          ],
        },
      ],
    },
  ]),
];
