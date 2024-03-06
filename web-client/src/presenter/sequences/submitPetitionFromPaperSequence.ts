import { assignPetitionToAuthenticatedUserAction } from '../actions/WorkItem/assignPetitionToAuthenticatedUserAction';
import { checkForActiveBatchesAction } from '../actions/checkForActiveBatchesAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearConfirmationTextStatisticsAction } from '../actions/clearConfirmationTextStatisticsAction';
import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { createCaseFromPaperAction } from '../actions/createCaseFromPaperAction';
import { filterEmptyStatisticsAction } from '../actions/StartCaseInternal/filterEmptyStatisticsAction';
import { getPetitionIdAction } from '../actions/getPetitionIdAction';
import { navigateToReviewSavedPetitionAction } from '../actions/CaseDetailEdit/navigateToReviewSavedPetitionAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseTypeAction } from '../actions/setCaseTypeAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setProgressForFileUploadAction } from '@web-client/presenter/actions/setProgressForFileUploadAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setupFilesForCaseCreationAction } from '@web-client/presenter/actions/CaseCreation/setupFilesForCaseCreationAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validatePetitionFromPaperAction } from '../actions/validatePetitionFromPaperAction';

export const submitPetitionFromPaperSequence = [
  checkForActiveBatchesAction,
  {
    hasActiveBatches: [setShowModalFactoryAction('UnfinishedScansModal')],
    noActiveBatches: [
      clearAlertsAction,
      startShowValidationAction,
      filterEmptyStatisticsAction,
      validatePetitionFromPaperAction,
      {
        error: [
          setAlertErrorAction,
          setValidationErrorsAction,
          setValidationAlertErrorsAction,
        ],
        success: [
          setupCurrentPageAction('Interstitial'),
          stopShowValidationAction,
          showProgressSequenceDecorator([
            setCaseTypeAction,
            setupFilesForCaseCreationAction,
            setProgressForFileUploadAction,
            createCaseFromPaperAction,
            {
              error: [openFileUploadErrorModal],
              success: [
                clearConfirmationTextStatisticsAction,
                setCaseAction,
                assignPetitionToAuthenticatedUserAction,
                getPetitionIdAction,
                setDocketEntryIdAction,
                closeFileUploadStatusModalAction,
                navigateToReviewSavedPetitionAction,
              ],
            },
          ]),
        ],
      },
    ],
  },
];
