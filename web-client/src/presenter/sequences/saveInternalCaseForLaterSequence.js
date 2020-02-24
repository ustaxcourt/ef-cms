import { assignPetitionToAuthenticatedUserAction } from '../actions/WorkItem/assignPetitionToAuthenticatedUserAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { computeIrsNoticeDateAction } from '../actions/StartCaseInternal/computeIrsNoticeDateAction';
import { createCaseFromPaperAction } from '../actions/createCaseFromPaperAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setFormCaseStatusToInProgressAction } from '../actions/StartCaseInternal/setFormCaseStatusToInProgressAction';
import { setPetitionIdAction } from '../actions/setPetitionIdAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const saveInternalCaseForLaterSequence = [
  clearAlertsAction,
  computeDateReceivedAction,
  computeIrsNoticeDateAction,
  setFormCaseStatusToInProgressAction,
  showProgressSequenceDecorator([
    createCaseFromPaperAction,
    {
      error: [openFileUploadErrorModal],
      success: [
        setCaseAction,
        assignPetitionToAuthenticatedUserAction,
        setPetitionIdAction,
        setDocumentIdAction,
        closeFileUploadStatusModalAction,
        setAlertSuccessAction,
        setSaveAlertsForNavigationAction,
        navigateToCaseDetailAction,
      ],
    },
  ]),
];
