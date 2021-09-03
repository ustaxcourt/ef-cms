import { assignPetitionToAuthenticatedUserAction } from '../actions/WorkItem/assignPetitionToAuthenticatedUserAction';
import { checkForActiveBatchesAction } from '../actions/checkForActiveBatchesAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
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
import { setPaperPetitionDatesSequence } from './setPaperPetitionDatesSequence';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
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
      setPaperPetitionDatesSequence,
      filterEmptyStatisticsAction,
      validatePetitionFromPaperAction,
      {
        error: [
          setAlertErrorAction,
          setValidationErrorsAction,
          setValidationAlertErrorsAction,
        ],
        success: [
          stopShowValidationAction,
          showProgressSequenceDecorator([
            setCaseTypeAction,
            createCaseFromPaperAction,
            {
              error: [openFileUploadErrorModal],
              success: [
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
