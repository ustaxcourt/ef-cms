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
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const saveInternalCaseForLaterSequence = [
  computeDateReceivedAction,
  computeIrsNoticeDateAction,
  setFormCaseStatusToInProgressAction,
  showProgressSequenceDecorator([
    createCaseFromPaperAction,
    {
      error: [openFileUploadErrorModal],
      success: [
        setCaseAction,
        setPetitionIdAction,
        setDocumentIdAction,
        closeFileUploadStatusModalAction,
        setAlertSuccessAction,
        navigateToCaseDetailAction,
      ],
    },
  ]),
];
