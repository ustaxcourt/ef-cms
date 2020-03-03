import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { createWorkItemAction } from '../actions/createWorkItemAction';
import { navigateToMessagesAction } from '../actions/navigateToMessagesAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateWorkItemFromPropsOrModalOrFormAction } from '../actions/WorkItem/updateWorkItemFromPropsOrModalOrFormAction';
import { validateInitialWorkItemMessageAction } from '../actions/validateInitialWorkItemMessageAction';

export const createWorkItemSequence = [
  startShowValidationAction,
  updateWorkItemFromPropsOrModalOrFormAction,
  validateInitialWorkItemMessageAction,
  {
    error: [setValidationErrorsByFlagAction],
    success: showProgressSequenceDecorator([
      createWorkItemAction,
      stopShowValidationAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      clearAlertsAction,
      clearFormAction,
      clearScreenMetadataAction,
      clearUsersAction,
      clearModalAction,
      clearModalStateAction,
      refreshCaseAction,
      navigateToMessagesAction,
    ]),
  },
];
