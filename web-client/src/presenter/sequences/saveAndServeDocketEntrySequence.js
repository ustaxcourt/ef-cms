import { checkForActiveBatchesAction } from '../actions/checkForActiveBatchesAction';
// import { chooseNextStepAction } from '../actions/DocketEntry/chooseNextStepAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { computeFormDateAction } from '../actions/FileDocument/computeFormDateAction';
import { computeSecondaryFormDateAction } from '../actions/FileDocument/computeSecondaryFormDateAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getDocketEntryAlertSuccessAction } from '../actions/DocketEntry/getDocketEntryAlertSuccessAction';
import { getDocumentIdAction } from '../actions/getDocumentIdAction';
// import { isEditModeAction } from '../actions/DocketEntry/isEditModeAction';
// import { isFileAttachedAction } from '../actions/isFileAttachedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { saveAndServeDocketEntryAction } from '../actions/DocketEntry/saveAndServeDocketEntryAction';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentUploadModeAction } from '../actions/setDocumentUploadModeAction';
// import { setIsUpdatingWithFileAction } from '../actions/DocketEntry/setIsUpdatingWithFileAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stashWizardDataAction } from '../actions/DocketEntry/stashWizardDataAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
// // import { submitDocketEntryWithoutFileAction } from '../actions/DocketEntry/submitDocketEntryWithoutFileAction';
// import { updateDocketEntryWithFileAction } from '../actions/DocketEntry/updateDocketEntryWithFileAction';
// import { updateDocketEntryWithoutFileAction } from '../actions/DocketEntry/updateDocketEntryWithoutFileAction';
import { uploadDocketEntryFileAction } from '../actions/DocketEntry/uploadDocketEntryFileAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

const afterEntryCreatedOrUpdated = showProgressSequenceDecorator([
  stashWizardDataAction,
  setCaseAction,
  closeFileUploadStatusModalAction,
  // chooseNextStepAction, use for isPaper / isElectronic
  {
    addAnotherEntry: [
      // isPaper: [ ...
      setDocumentUploadModeAction,
      getDocketEntryAlertSuccessAction,
      setAlertSuccessAction,
      stopShowValidationAction,
      clearFormAction,
      clearScreenMetadataAction,
      set(state.form.lodged, false),
      set(state.form.privatePractitioners, []),
      set(state.currentViewMetadata.documentUploadMode, 'scan'),
    ],
    caseDetail: [
      // isElectronic: [
      getDocketEntryAlertSuccessAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      navigateToCaseDetailAction,
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
      validateDocketEntryAction,
      // validateDocketEntryForServiceAction,
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
              saveAndServeDocketEntryAction,
              afterEntryCreatedOrUpdated,
            ],
          },
        ],
      },
    ],
  },
];
