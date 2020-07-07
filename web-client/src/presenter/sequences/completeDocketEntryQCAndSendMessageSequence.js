import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { completeDocketEntryQCAction } from '../actions/EditDocketRecord/completeDocketEntryQCAction';
import { createCaseMessageAction } from '../actions/CaseDetail/createCaseMessageAction';
import { getCaseMessagesForCaseAction } from '../actions/CaseDetail/getCaseMessagesForCaseAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCompleteDocketEntryAlertAction } from '../actions/DocketEntry/setCompleteDocketEntryAlertAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCreateCaseMessageAction } from '../actions/validateCreateCaseMessageAction';

export const completeDocketEntryQCAndSendMessageSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateCreateCaseMessageAction,
  {
    error: [setValidationErrorsByFlagAction],
    success: showProgressSequenceDecorator([
      createCaseMessageAction,
      stopShowValidationAction,
      completeDocketEntryQCAction,
      clearFormAction,
      clearScreenMetadataAction,
      clearUsersAction,
      clearModalAction,
      clearModalStateAction,
      setCompleteDocketEntryAlertAction,
      setSaveAlertsForNavigationAction,
      setCaseAction,
      setAlertSuccessAction,
      getCaseMessagesForCaseAction,
      navigateToDocumentQCAction,
    ]),
  },
];
