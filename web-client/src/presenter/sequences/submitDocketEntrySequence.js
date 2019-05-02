import { chooseNextStepAction } from '../actions/DocketEntry/chooseNextStepAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getDocketEntryAlertSuccessAction } from '../actions/DocketEntry/getDocketEntryAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { restoreWizardDataAction } from '../actions/DocketEntry/restoreWizardDataAction';
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
      setCurrentPageAction('Interstitial'),
      generateTitleAction,
      set(state.showValidation, false),
      clearAlertsAction,
      uploadExternalDocumentsAction,
      submitDocketEntryAction,
      stashWizardDataAction,
      setCaseAction,
      chooseNextStepAction,
      {
        caseDetail: [
          getDocketEntryAlertSuccessAction,
          setAlertSuccessAction,
          set(state.saveAlertsForNavigation, true),
          navigateToCaseDetailAction,
        ],
        supportingDocument: [
          getDocketEntryAlertSuccessAction,
          setAlertSuccessAction,
          clearFormAction,
          restoreWizardDataAction,
          set(state.wizardStep, 'SupportingDocumentForm'),
          setCurrentPageAction('AddDocketEntry'),
        ],
      },
    ],
  },
];
