import { assignPetitionToAuthenticatedUserAction } from '../actions/WorkItem/assignPetitionToAuthenticatedUserAction';
import { checkForActiveBatchesAction } from '../actions/checkForActiveBatchesAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { computeFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { computeStatisticDatesAction } from '../actions/StartCaseInternal/computeStatisticDatesAction';
import { createCaseFromPaperAction } from '../actions/createCaseFromPaperAction';
import { filterEmptyStatisticsAction } from '../actions/StartCaseInternal/filterEmptyStatisticsAction';
import { navigateToReviewSavedPetitionAction } from '../actions/caseDetailEdit/navigateToReviewSavedPetitionAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseTypeAction } from '../actions/setCaseTypeAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setComputeFormDayFactoryAction } from '../actions/setComputeFormDayFactoryAction';
import { setComputeFormMonthFactoryAction } from '../actions/setComputeFormMonthFactoryAction';
import { setComputeFormYearFactoryAction } from '../actions/setComputeFormYearFactoryAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setPetitionIdAction } from '../actions/setPetitionIdAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
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
      // receivedAt
      setComputeFormDayFactoryAction('receivedAtDay'),
      setComputeFormMonthFactoryAction('receivedAtMonth'),
      setComputeFormYearFactoryAction('receivedAtYear'),
      computeFormDateFactoryAction(null, true),
      setComputeFormDateFactoryAction('receivedAt'),
      // irsNoticeDate
      setComputeFormDayFactoryAction('irsDay'),
      setComputeFormMonthFactoryAction('irsMonth'),
      setComputeFormYearFactoryAction('irsYear'),
      computeFormDateFactoryAction(null, true),
      setComputeFormDateFactoryAction('irsNoticeDate'),
      // petitionPaymentDate
      setComputeFormDayFactoryAction('paymentDateDay'),
      setComputeFormMonthFactoryAction('paymentDateMonth'),
      setComputeFormYearFactoryAction('paymentDateYear'),
      computeFormDateFactoryAction(null, true),
      setComputeFormDateFactoryAction('petitionPaymentDate'),
      // paymentDateWaived
      setComputeFormDayFactoryAction('paymentDateWaivedDay'),
      setComputeFormMonthFactoryAction('paymentDateWaivedMonth'),
      setComputeFormYearFactoryAction('paymentDateWaivedYear'),
      computeFormDateFactoryAction(null, true),
      setComputeFormDateFactoryAction('petitionPaymentWaivedDate'),
      computeStatisticDatesAction,
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
                setPetitionIdAction,
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
