import { clearModalStateAction } from '../actions/clearModalStateAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isWorkItemAlreadyCompletedAction } from '../actions/isWorkItemAlreadyCompletedAction';
import { refreshExternalDocumentTitleFromEventCodeAction } from '../actions/FileDocument/refreshExternalDocumentTitleFromEventCodeAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setPreviousDocumentDocketEntryAction } from '../actions/FileDocument/setPreviousDocumentDocketEntryAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';
import { stopShowValidationAction } from '@web-client/presenter/actions/stopShowValidationAction';
import { updateMessageModalAfterQCAction } from '../actions/updateMessageModalAfterQCAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

export const openCompleteAndSendMessageModalSequence = [
  getCaseAction,
  setCaseAction,
  isWorkItemAlreadyCompletedAction,
  {
    no: [
      startShowValidationAction,
      setFilersFromFilersMapAction,
      validateDocketEntryAction,
      {
        error: [
          setValidationErrorsAction,
          setScrollToErrorNotificationAction,
          setValidationAlertErrorsAction,
        ],
        success: [
          stopShowValidationAction,
          clearModalStateAction,
          refreshExternalDocumentTitleFromEventCodeAction,
          setPreviousDocumentDocketEntryAction,
          generateTitleAction,
          updateMessageModalAfterQCAction,
          setShowModalFactoryAction('CreateMessageModalDialog'),
        ],
      },
    ],
    yes: [setShowModalFactoryAction('WorkItemAlreadyCompletedModal')],
  },
];
