import { checkForActiveBatchesAction } from '../actions/checkForActiveBatchesAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { generateTitleForPaperFilingAction } from '../actions/FileDocument/generateTitleForPaperFilingAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { getDocketEntryAlertSuccessAction } from '../actions/DocketEntry/getDocketEntryAlertSuccessAction';
import { getDocketNumbersForConsolidatedServiceAction } from '../actions/getDocketNumbersForConsolidatedServiceAction';
import { getShouldGoToPaperServiceAction } from '../actions/DocketEntry/getShouldGoToPaperServiceAction';
import { gotoPrintPaperServiceSequence } from './gotoPrintPaperServiceSequence';
import { isEditingDocketEntryAction } from '../actions/CourtIssuedDocketEntry/isEditingDocketEntryAction';
import { isFileAttachedAction } from '../actions/isFileAttachedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setDocumentIsRequiredAction } from '../actions/DocketEntry/setDocumentIsRequiredAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitAddPaperFilingAction } from '../actions/DocketEntry/submitAddPaperFilingAction';
import { submitEditPaperFilingAction } from '../actions/DocketEntry/submitEditPaperFilingAction';
import { suggestSaveForLaterValidationAction } from '../actions/DocketEntry/suggestSaveForLaterValidationAction';
import { uploadDocketEntryFileAction } from '../actions/DocketEntry/uploadDocketEntryFileAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';
import { validateUploadedPdfAction } from '../actions/CourtIssuedDocketEntry/validateUploadedPdfAction';

const addPaperFilingMultiDocketableFlow = [
  closeFileUploadStatusModalAction,
  setWaitingForResponseAction,
  getDocketNumbersForConsolidatedServiceAction,
  submitAddPaperFilingAction,
];

const editPaperFilingNotMultiDocketableFlow = [
  submitEditPaperFilingAction,
  setCaseAction,
  closeFileUploadStatusModalAction,
  getShouldGoToPaperServiceAction,
  {
    no: [
      getDocketEntryAlertSuccessAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      navigateToCaseDetailAction,
    ],
    yes: [setPdfPreviewUrlAction, gotoPrintPaperServiceSequence],
  },
];

export const submitPaperFilingSequence = [
  checkForActiveBatchesAction,
  {
    hasActiveBatches: [setShowModalFactoryAction('UnfinishedScansModal')],
    noActiveBatches: [
      clearAlertsAction,
      startShowValidationAction,
      getComputedFormDateFactoryAction('serviceDate'),
      setComputeFormDateFactoryAction('serviceDate'),
      computeCertificateOfServiceFormDateAction,
      getComputedFormDateFactoryAction('dateReceived'),
      setComputeFormDateFactoryAction('dateReceived'),
      setDocumentIsRequiredAction,
      generateTitleForPaperFilingAction,
      setFilersFromFilersMapAction,
      validateDocketEntryAction,
      {
        error: [
          suggestSaveForLaterValidationAction,
          setAlertErrorAction,
          setValidationErrorsAction,
          setValidationAlertErrorsAction,
        ],
        success: [
          stopShowValidationAction,
          clearAlertsAction,
          isEditingDocketEntryAction,
          {
            no: [
              isFileAttachedAction,
              {
                no: addPaperFilingMultiDocketableFlow,
                yes: [
                  openFileUploadStatusModalAction,
                  uploadDocketEntryFileAction,
                  {
                    error: [openFileUploadErrorModal],
                    success: [
                      validateUploadedPdfAction,
                      addPaperFilingMultiDocketableFlow,
                    ],
                  },
                ],
              },
            ],
            yes: [
              isFileAttachedAction,
              {
                no: editPaperFilingNotMultiDocketableFlow,
                yes: [
                  openFileUploadStatusModalAction,
                  uploadDocketEntryFileAction,
                  {
                    error: [openFileUploadErrorModal],
                    success: [
                      validateUploadedPdfAction,
                      editPaperFilingNotMultiDocketableFlow,
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
