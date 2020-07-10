import { checkForActiveBatchesAction } from '../actions/checkForActiveBatchesAction';
import { chooseNextStepAction } from '../actions/DocketEntry/chooseNextStepAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { completeDocketEntryQCAction } from '../actions/EditDocketRecord/completeDocketEntryQCAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { computeFormDateAction } from '../actions/FileDocument/computeFormDateAction';
import { computeSecondaryFormDateAction } from '../actions/FileDocument/computeSecondaryFormDateAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getDocketEntryAlertSuccessAction } from '../actions/DocketEntry/getDocketEntryAlertSuccessAction';
import { gotoPrintPaperServiceSequence } from './gotoPrintPaperServiceSequence';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { saveDocketEntryAction } from '../actions/DocketEntry/saveDocketEntryAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentIsRequiredAction } from '../actions/DocketEntry/setDocumentIsRequiredAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { uploadDocketEntryFileAction } from '../actions/DocketEntry/uploadDocketEntryFileAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

const afterEntryCreated = showProgressSequenceDecorator([
  setCaseAction,
  closeFileUploadStatusModalAction,
  chooseNextStepAction,
  {
    isElectronic: [
      getDocketEntryAlertSuccessAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      navigateToCaseDetailAction,
    ],
    isPaper: [
      completeDocketEntryQCAction,
      setPdfPreviewUrlAction,
      gotoPrintPaperServiceSequence,
    ],
  },
]);

export const saveAndServeDocketEntrySequence = [
  checkForActiveBatchesAction,
  {
    hasActiveBatches: [setShowModalFactoryAction('UnfinishedScansModal')],
    noActiveBatches: [
      clearAlertsAction,
      startShowValidationAction,
      computeFormDateAction,
      computeSecondaryFormDateAction,
      computeCertificateOfServiceFormDateAction,
      computeDateReceivedAction,
      setDocumentIsRequiredAction,
      validateDocketEntryAction,
      {
        error: [
          setAlertErrorAction,
          setValidationErrorsAction,
          setValidationAlertErrorsAction,
        ],
        success: [
          generateTitleAction,
          stopShowValidationAction,
          clearAlertsAction,
          openFileUploadStatusModalAction,
          uploadDocketEntryFileAction,
          {
            error: [openFileUploadErrorModal],
            success: [saveDocketEntryAction, afterEntryCreated],
          },
        ],
      },
    ],
  },
];
