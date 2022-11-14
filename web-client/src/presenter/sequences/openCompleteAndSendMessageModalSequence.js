import { clearModalStateAction } from '../actions/clearModalStateAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { formHasSecondaryDocumentAction } from '../actions/FileDocument/formHasSecondaryDocumentAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { isWorkItemAlreadyCompletedAction } from '../actions/isWorkItemAlreadyCompletedAction';
import { refreshExternalDocumentTitleFromEventCodeAction } from '../actions/FileDocument/refreshExternalDocumentTitleFromEventCodeAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { updateMessageModalAfterQCAction } from '../actions/updateMessageModalAfterQCAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

export const openCompleteAndSendMessageModalSequence = [
  getCaseAction,
  setCaseAction,
  isWorkItemAlreadyCompletedAction,
  {
    no: [
      formHasSecondaryDocumentAction,
      {
        no: [],
        yes: [
          getComputedFormDateFactoryAction('secondaryDocument.serviceDate'),
          setComputeFormDateFactoryAction('secondaryDocument.serviceDate'),
        ],
      },
      computeCertificateOfServiceFormDateAction,
      getComputedFormDateFactoryAction('dateReceived'),
      setComputeFormDateFactoryAction('dateReceived'),
      getComputedFormDateFactoryAction('serviceDate'),
      setComputeFormDateFactoryAction('serviceDate'),
      setFilersFromFilersMapAction,
      validateDocketEntryAction,
      {
        error: [
          setAlertErrorAction,
          setValidationErrorsAction,
          setValidationAlertErrorsAction,
        ],
        success: [
          clearModalStateAction,
          refreshExternalDocumentTitleFromEventCodeAction,
          generateTitleAction,
          updateMessageModalAfterQCAction,
          setShowModalFactoryAction('CreateMessageModalDialog'),
        ],
      },
    ],
    yes: [setShowModalFactoryAction('WorkItemAlreadyCompletedModal')],
  },
];
