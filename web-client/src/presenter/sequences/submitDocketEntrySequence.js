import { chooseNextStepAction } from '../actions/DocketEntry/chooseNextStepAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { computeFormDateAction } from '../actions/FileDocument/computeFormDateAction';
import { computeSecondaryFormDateAction } from '../actions/FileDocument/computeSecondaryFormDateAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getDocketEntryAlertSuccessAction } from '../actions/DocketEntry/getDocketEntryAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { stashWizardDataAction } from '../actions/DocketEntry/stashWizardDataAction';
import { state } from 'cerebral';
import { submitDocketEntryAction } from '../actions/DocketEntry/submitDocketEntryAction';
import { uploadExternalDocumentsAction } from '../actions/FileDocument/uploadExternalDocumentsAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

export const submitDocketEntrySequence = [
  clearAlertsAction,
  set(state.showValidation, true),
  computeFormDateAction,
  computeSecondaryFormDateAction,
  computeCertificateOfServiceFormDateAction,
  computeDateReceivedAction,
  validateDocketEntryAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      generateTitleAction,
      set(state.showValidation, false),
      clearAlertsAction,
      openFileUploadStatusModalAction,
      uploadExternalDocumentsAction,
      {
        error: [openFileUploadErrorModal],
        success: [
          submitDocketEntryAction,
          stashWizardDataAction,
          setCaseAction,
          closeFileUploadStatusModalAction,
          chooseNextStepAction,
          {
            caseDetail: [
              getDocketEntryAlertSuccessAction,
              setAlertSuccessAction,
              set(state.saveAlertsForNavigation, true),
              navigateToCaseDetailAction,
            ],
            supportingDocument: [
              set(state.screenMetadata.supporting, true),
              getDocketEntryAlertSuccessAction,
              setAlertSuccessAction,
              clearFormAction,
              set(state.wizardStep, 'SupportingDocumentForm'),
              setCurrentPageAction('Interstitial', { force: true }),
              setCurrentPageAction('AddDocketEntry'),
            ],
          },
        ],
      },
    ],
  },
];
