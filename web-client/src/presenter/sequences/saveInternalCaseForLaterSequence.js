import { clearAlertsAction } from '../actions/clearAlertsAction';
import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { computeIrsNoticeDateAction } from '../actions/StartCaseInternal/computeIrsNoticeDateAction';
import { computePetitionFeeDatesAction } from '../actions/StartCaseInternal/computePetitionFeeDatesAction';
import { computeReceivedAtDateAction } from '../actions/caseDetailEdit/computeReceivedAtDateAction';
import { createCaseFromPaperAction } from '../actions/createCaseFromPaperAction';
import { getSaveCaseForLaterAlertSuccessAction } from '../actions/StartCaseInternal/getSaveCaseForLaterAlertSuccessAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setPetitionIdAction } from '../actions/setPetitionIdAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const saveInternalCaseForLaterSequence = [
  clearAlertsAction,
  computeReceivedAtDateAction,
  computeIrsNoticeDateAction,
  computePetitionFeeDatesAction,
  showProgressSequenceDecorator([
    createCaseFromPaperAction,
    {
      error: [openFileUploadErrorModal],
      success: [
        setCaseAction,
        setPetitionIdAction,
        setDocumentIdAction,
        closeFileUploadStatusModalAction,
        getSaveCaseForLaterAlertSuccessAction,
        setAlertSuccessAction,
        setSaveAlertsForNavigationAction,
        navigateToDocumentQCAction,
      ],
    },
  ]),
];
