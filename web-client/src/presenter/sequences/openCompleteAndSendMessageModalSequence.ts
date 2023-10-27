import { clearModalStateAction } from '../actions/clearModalStateAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isWorkItemAlreadyCompletedAction } from '../actions/isWorkItemAlreadyCompletedAction';
import { refreshExternalDocumentTitleFromEventCodeAction } from '../actions/FileDocument/refreshExternalDocumentTitleFromEventCodeAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setPreviousDocumentDocketEntryAction } from '../actions/FileDocument/setPreviousDocumentDocketEntryAction';
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
