import { checkForActiveBatchesAction } from '../actions/checkForActiveBatchesAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { docketEntryFileUploadSequenceDecorator } from '../utilities/docketEntryFileUploadSequenceDecorator';
import { generateTitleForPaperFilingAction } from '../actions/FileDocument/generateTitleForPaperFilingAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { getDocketNumbersForConsolidatedServiceAction } from '../actions/getDocketNumbersForConsolidatedServiceAction';
import { isEditingDocketEntryAction } from '../actions/CourtIssuedDocketEntry/isEditingDocketEntryAction';
import { isFileAttachedAction } from '../actions/isFileAttachedAction';
import { isWorkItemAlreadyCompletedAction } from '../actions/isWorkItemAlreadyCompletedAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setDocumentIsRequiredAction } from '../actions/DocketEntry/setDocumentIsRequiredAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
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

export const submitPaperFilingSequence = [
  clearModalAction,
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
              setWaitingForResponseAction,
              getDocketNumbersForConsolidatedServiceAction,
              isFileAttachedAction,
              {
                no: [submitAddPaperFilingAction],
                yes: docketEntryFileUploadSequenceDecorator([
                  submitAddPaperFilingAction,
                ]),
              },
            ],
            yes: [
              setWaitingForResponseAction,
              getDocketNumbersForConsolidatedServiceAction,
              getCaseAction,
              setCaseAction,
              isWorkItemAlreadyCompletedAction,
              {
                no: [
                  isFileAttachedAction,
                  {
                    no: [submitEditPaperFilingAction],
                    yes: docketEntryFileUploadSequenceDecorator([
                      submitEditPaperFilingAction,
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
