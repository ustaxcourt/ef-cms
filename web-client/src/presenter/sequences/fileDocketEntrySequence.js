import { checkForActiveBatchesAction } from '../actions/checkForActiveBatchesAction';
import { chooseNextStepAction } from '../actions/DocketEntry/chooseNextStepAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { completeDocketEntryQCAction } from '../actions/EditDocketRecord/completeDocketEntryQCAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { computeFormDateAction } from '../actions/FileDocument/computeFormDateAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getDocketEntryAlertSuccessAction } from '../actions/DocketEntry/getDocketEntryAlertSuccessAction';
import { getDocumentIdAction } from '../actions/getDocumentIdAction';
import { getIsSavingForLaterAction } from '../actions/DocketEntry/getIsSavingForLaterAction';
import { gotoPrintPaperServiceSequence } from './gotoPrintPaperServiceSequence';
import { isFileAttachedAction } from '../actions/isFileAttachedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { saveDocketEntryAction } from '../actions/DocketEntry/saveDocketEntryAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setDocumentIsRequiredAction } from '../actions/DocketEntry/setDocumentIsRequiredAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { suggestSaveForLaterValidationAction } from '../actions/DocketEntry/suggestSaveForLaterValidationAction';
import { uploadDocketEntryFileAction } from '../actions/DocketEntry/uploadDocketEntryFileAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

const gotoCaseDetail = [
  getDocketEntryAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  navigateToCaseDetailAction,
];

const afterEntrySaved = [
  setCaseAction,
  closeFileUploadStatusModalAction,
  chooseNextStepAction,
  {
    isElectronic: gotoCaseDetail,
    isPaper: [
      getIsSavingForLaterAction,
      {
        no: [
          setDocumentIdAction,
          setPdfPreviewUrlAction,
          gotoPrintPaperServiceSequence,
          completeDocketEntryQCAction,
        ],
        yes: gotoCaseDetail,
      },
    ],
  },
];

export const fileDocketEntrySequence = [
  checkForActiveBatchesAction,
  {
    hasActiveBatches: [setShowModalFactoryAction('UnfinishedScansModal')],
    noActiveBatches: [
      clearAlertsAction,
      startShowValidationAction,
      computeFormDateAction,
      computeCertificateOfServiceFormDateAction,
      computeDateReceivedAction,
      setDocumentIsRequiredAction,
      validateDocketEntryAction,
      {
        error: [
          suggestSaveForLaterValidationAction,
          setAlertErrorAction,
          setValidationErrorsAction,
          setValidationAlertErrorsAction,
        ],
        success: [
          generateTitleAction,
          stopShowValidationAction,
          clearAlertsAction,
          isFileAttachedAction,
          {
            no: showProgressSequenceDecorator([
              saveDocketEntryAction,
              afterEntrySaved,
            ]),
            yes: [
              openFileUploadStatusModalAction,
              getDocumentIdAction,
              uploadDocketEntryFileAction,
              {
                error: [openFileUploadErrorModal],
                success: showProgressSequenceDecorator([
                  saveDocketEntryAction,
                  closeFileUploadStatusModalAction,
                  afterEntrySaved,
                ]),
              },
            ],
          },
        ],
      },
    ],
  },
];
