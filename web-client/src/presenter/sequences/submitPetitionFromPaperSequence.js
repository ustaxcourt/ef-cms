import { checkForActiveBatchesAction } from '../actions/checkForActiveBatchesAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { computeFormDateAction } from '../actions/computeFormDateAction';
import { createCaseFromPaperAction } from '../actions/createCaseFromPaperAction';
import { gotoDocumentDetailSequence } from '../sequences/gotoDocumentDetailSequence';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setPetitionIdAction } from '../actions/setPetitionIdAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validatePetitionFromPaperAction } from '../actions/validatePetitionFromPaperAction';

export const submitPetitionFromPaperSequence = [
  checkForActiveBatchesAction,
  {
    hasActiveBatches: [set(state.showModal, 'UnfinishedScansModal')],
    noActiveBatches: [
      clearAlertsAction,
      startShowValidationAction,
      computeFormDateAction,
      validatePetitionFromPaperAction,
      {
        error: [
          setAlertErrorAction,
          setValidationErrorsAction,
          setValidationAlertErrorsAction,
        ],
        success: [
          stopShowValidationAction,
          openFileUploadStatusModalAction,
          createCaseFromPaperAction,
          {
            error: [openFileUploadErrorModal],
            success: [
              setCaseAction,
              setPetitionIdAction,
              closeFileUploadStatusModalAction,
              ...gotoDocumentDetailSequence,
            ],
          },
        ],
      },
    ],
  },
];
