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
import { getDocumentIdAction } from '../actions/getDocumentIdAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { saveAndServeDocketEntryAction } from '../actions/DocketEntry/saveAndServeDocketEntryAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
// import { setIsUpdatingWithFileAction } from '../actions/DocketEntry/setIsUpdatingWithFileAction';
import { gotoPrintPaperServiceSequence } from './gotoPrintPaperServiceSequence';
import { setDocumentIsRequiredAction } from '../actions/DocketEntry/setDocumentIsRequiredAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stashWizardDataAction } from '../actions/DocketEntry/stashWizardDataAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
// import { submitDocketEntryWithoutFileAction } from '../actions/DocketEntry/submitDocketEntryWithoutFileAction';
// import { updateDocketEntryWithFileAction } from '../actions/DocketEntry/updateDocketEntryWithFileAction';
// import { updateDocketEntryWithoutFileAction } from '../actions/DocketEntry/updateDocketEntryWithoutFileAction';
import { uploadDocketEntryFileAction } from '../actions/DocketEntry/uploadDocketEntryFileAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

const afterEntryCreatedOrUpdated = showProgressSequenceDecorator([
  stashWizardDataAction,
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
    isPaper: [completeDocketEntryQCAction, gotoPrintPaperServiceSequence],
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
          getDocumentIdAction,
          uploadDocketEntryFileAction,
          {
            error: [openFileUploadErrorModal],
            success: [
              setDocumentIdAction,
              saveAndServeDocketEntryAction,
              afterEntryCreatedOrUpdated,
            ],
          },
        ],
      },
    ],
  },
];
