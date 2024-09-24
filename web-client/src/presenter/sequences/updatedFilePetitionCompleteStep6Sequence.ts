import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { closeFileUploadStatusModalAction } from '@web-client/presenter/actions/closeFileUploadStatusModalAction';
import { debounceSequenceDecorator } from '@web-client/presenter/utilities/debounceSequenceDecorator';
import { generatePetitionPdfAction } from '@web-client/presenter/actions/generatePetitionPdfAction';
import { incrementCurrentStepIndicatorAction } from '@web-client/presenter/actions/incrementCurrentStepIndicatorAction';
import { openFileUploadErrorModal } from '@web-client/presenter/actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '@web-client/presenter/actions/openFileUploadStatusModalAction';
import { saveAndSubmitCaseAction } from '@web-client/presenter/actions/saveAndSubmitCaseAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { setCaseAction } from '@web-client/presenter/actions/setCaseAction';
import { setProgressForFileUploadAction } from '@web-client/presenter/actions/setProgressForFileUploadAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '@web-client/presenter/actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '@web-client/presenter/actions/setWaitingForResponseAction';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';
import { stopShowValidationAction } from '@web-client/presenter/actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';
import { updatedSetupFilesForCaseCreationAction } from '@web-client/presenter/actions/CaseCreation/updatedSetupFilesForCaseCreationAction';
import { updatedValidatePetitionAction } from '@web-client/presenter/actions/updatedValidatePetitionAction';

export const updatedFilePetitionCompleteStep6Sequence =
  debounceSequenceDecorator(500, [
    clearAlertsAction,
    startShowValidationAction,
    setWaitingForResponseAction,
    generatePetitionPdfAction,
    updatedValidatePetitionAction,
    {
      error: [
        unsetWaitingForResponseAction,
        setAlertErrorAction,
        setValidationErrorsAction,
        setValidationAlertErrorsAction,
      ],
      success: [
        unsetWaitingForResponseAction,
        stopShowValidationAction,
        openFileUploadStatusModalAction,
        updatedSetupFilesForCaseCreationAction,
        setProgressForFileUploadAction,
        saveAndSubmitCaseAction,
        {
          error: [setAlertErrorAction, openFileUploadErrorModal],
          success: [
            closeFileUploadStatusModalAction,
            setCaseAction,
            setAlertSuccessAction,
            incrementCurrentStepIndicatorAction,
          ],
        },
      ],
    },
  ]) as unknown as () => void;
