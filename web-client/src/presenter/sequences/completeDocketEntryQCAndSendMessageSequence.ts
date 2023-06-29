import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { completeDocketEntryQCAction } from '../actions/EditDocketRecord/completeDocketEntryQCAction';
import { createMessageAction } from '../actions/CaseDetail/createMessageAction';
import { getMessagesForCaseAction } from '../actions/CaseDetail/getMessagesForCaseAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setPaperServicePartiesAction } from '../actions/setPaperServicePartiesAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { switchErrorActionFactory } from '../actions/switchErrorActionFactory';
import { validateCreateMessageAction } from '../actions/validateCreateMessageAction';

export const completeDocketEntryQCAndSendMessageSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateCreateMessageAction,
  {
    error: [setValidationErrorsByFlagAction],
    success: showProgressSequenceDecorator([
      createMessageAction,
      stopShowValidationAction,
      completeDocketEntryQCAction,
      {
        error: [
          switchErrorActionFactory({
            'currently being updated': 'completed',
          }),
          {
            completed: [
              setShowModalFactoryAction('WorkItemAlreadyCompletedModal'),
            ],
            default: [setShowModalFactoryAction('GenericErrorModal')],
          },
        ],
        success: [
          clearScreenMetadataAction,
          clearUsersAction,
          clearModalAction,
          setSaveAlertsForNavigationAction,
          setCaseAction,
          setAlertSuccessAction,
          getMessagesForCaseAction,
          setPdfPreviewUrlAction,
          setPaperServicePartiesAction,
          navigateToDocumentQCAction,
          clearFormAction,
        ],
      },
    ]),
  },
];
