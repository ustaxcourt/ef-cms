import { clearModalStateAction } from '../actions/clearModalStateAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { computeFormDateFactoryAction } from '../actions/computeFormDateFactoryAction';
import { formHasSecondaryDocumentAction } from '../actions/FileDocument/formHasSecondaryDocumentAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setComputeFormDayFactoryAction } from '../actions/setComputeFormDayFactoryAction';
import { setComputeFormMonthFactoryAction } from '../actions/setComputeFormMonthFactoryAction';
import { setComputeFormYearFactoryAction } from '../actions/setComputeFormYearFactoryAction';
import { setCreateMessageModalDialogModalStateAction } from '../actions/WorkItem/setCreateMessageModalDialogModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { updateMessageModalAttachmentsAction } from '../actions/updateMessageModalAttachmentsAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

export const openCompleteAndSendMessageModalSequence = [
  formHasSecondaryDocumentAction,
  {
    no: [],
    yes: [
      setComputeFormDayFactoryAction('secondaryDocument.day'),
      setComputeFormMonthFactoryAction('secondaryDocument.month'),
      setComputeFormYearFactoryAction('secondaryDocument.year'),
      computeFormDateFactoryAction(null),
      setComputeFormDateFactoryAction('secondaryDocument.serviceDate'),
    ],
  },
  computeCertificateOfServiceFormDateAction,
  setComputeFormDayFactoryAction('dateReceivedDay'),
  setComputeFormMonthFactoryAction('dateReceivedMonth'),
  setComputeFormYearFactoryAction('dateReceivedYear'),
  computeFormDateFactoryAction(null),
  setComputeFormDateFactoryAction('dateReceived'),
  validateDocketEntryAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      clearModalStateAction,
      generateTitleAction,
      setCreateMessageModalDialogModalStateAction,
      updateMessageModalAttachmentsAction,
      setShowModalFactoryAction('CreateMessageModalDialog'),
    ],
  },
];
