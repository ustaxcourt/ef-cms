import { checkForActiveBatchesAction } from '../actions/checkForActiveBatchesAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { docketEntryFileUploadSequenceDecorator } from '../utilities/docketEntryFileUploadSequenceDecorator';
import { generateCoversheetAction } from '../actions/DocketEntry/generateCoversheetAction';
import { generateTitleForPaperFilingAction } from '../actions/FileDocument/generateTitleForPaperFilingAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { getDocketEntryAlertSuccessAction } from '../actions/DocketEntry/getDocketEntryAlertSuccessAction';
import { getDocketNumbersForConsolidatedServiceAction } from '../actions/getDocketNumbersForConsolidatedServiceAction';
import { getShouldGoToPaperServiceAction } from '../actions/DocketEntry/getShouldGoToPaperServiceAction';
import { gotoPrintPaperServiceSequence } from './gotoPrintPaperServiceSequence';
import { isCoversheetNeededAction } from '../actions/DocketEntry/isCoversheetNeededAction';
import { isEditingDocketEntryAction } from '../actions/CourtIssuedDocketEntry/isEditingDocketEntryAction';
import { isFileAttachedAction } from '../actions/isFileAttachedAction';
import { isWorkItemAlreadyCompletedAction } from '../actions/isWorkItemAlreadyCompletedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
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
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

const addPaperFilingMultiDocketableFlow = [
  setWaitingForResponseAction,
  getDocketNumbersForConsolidatedServiceAction,
  submitAddPaperFilingAction,
];

const editPaperFilingNotMultiDocketableFlow = [
  getDocketNumbersForConsolidatedServiceAction,
  submitEditPaperFilingAction,
  isCoversheetNeededAction,
  {
    no: [],
    yes: [generateCoversheetAction],
  },
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
                yes: docketEntryFileUploadSequenceDecorator([
                  addPaperFilingMultiDocketableFlow,
                ]),
              },
            ],
            yes: [
              getCaseAction,
              setCaseAction,
              isWorkItemAlreadyCompletedAction,
              {
                no: [
                  isFileAttachedAction,
                  {
                    no: editPaperFilingNotMultiDocketableFlow,
                    yes: docketEntryFileUploadSequenceDecorator([
                      editPaperFilingNotMultiDocketableFlow,
                    ]),
                  },
                ],
                yes: [
                  setShowModalFactoryAction('WorkItemAlreadyCompletedModal'),
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
