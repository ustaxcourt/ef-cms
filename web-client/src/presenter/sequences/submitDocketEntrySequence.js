import { checkForActiveBatchesAction } from '../actions/checkForActiveBatchesAction';
import { chooseNextStepAction } from '../actions/DocketEntry/chooseNextStepAction';
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
import { isEditModeAction } from '../actions/DocketEntry/isEditModeAction';
import { isFileAttachedAction } from '../actions/isFileAttachedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { set, unset } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentUploadModeAction } from '../actions/setDocumentUploadModeAction';
import { setIsUpdatingWithFileAction } from '../actions/DocketEntry/setIsUpdatingWithFileAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { stashWizardDataAction } from '../actions/DocketEntry/stashWizardDataAction';
import { state } from 'cerebral';
import { submitDocketEntryWithFileAction } from '../actions/DocketEntry/submitDocketEntryWithFileAction';
import { submitDocketEntryWithoutFileAction } from '../actions/DocketEntry/submitDocketEntryWithoutFileAction';
import { updateDocketEntryWithFileAction } from '../actions/DocketEntry/updateDocketEntryWithFileAction';
import { updateDocketEntryWithoutFileAction } from '../actions/DocketEntry/updateDocketEntryWithoutFileAction';
import { uploadDocketEntryFileAction } from '../actions/DocketEntry/uploadDocketEntryFileAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

const afterEntryCreatedOrUpdated = [
  stashWizardDataAction,
  setCaseAction,
  closeFileUploadStatusModalAction,
  chooseNextStepAction,
  {
    addAnotherEntry: [
      setDocumentUploadModeAction,
      getDocketEntryAlertSuccessAction,
      setAlertSuccessAction,
      set(state.showValidation, false),
      clearFormAction,
      clearScreenMetadataAction,
      set(state.form.lodged, false),
      set(state.form.practitioner, []),
      set(state.documentUploadMode, 'scan'),
    ],
    caseDetail: [
      getDocketEntryAlertSuccessAction,
      setAlertSuccessAction,
      set(state.saveAlertsForNavigation, true),
      navigateToCaseDetailAction,
    ],
  },
];

export const submitDocketEntrySequence = [
  checkForActiveBatchesAction,
  {
    hasActiveBatches: [set(state.showModal, 'UnfinishedScansModal')],
    noActiveBatches: [
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
          unset(state.isUpdatingWithFile),
          generateTitleAction,
          set(state.showValidation, false),
          clearAlertsAction,
          setIsUpdatingWithFileAction,
          isFileAttachedAction,
          {
            no: [
              isEditModeAction,
              {
                no: [submitDocketEntryWithoutFileAction],
                yes: [updateDocketEntryWithoutFileAction],
              },
              ...afterEntryCreatedOrUpdated,
            ],
            yes: [
              openFileUploadStatusModalAction,
              getDocumentIdAction,
              uploadDocketEntryFileAction,
              {
                error: [openFileUploadErrorModal],
                success: [
                  isEditModeAction,
                  {
                    no: [submitDocketEntryWithFileAction],
                    yes: [updateDocketEntryWithFileAction],
                  },
                  ...afterEntryCreatedOrUpdated,
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
