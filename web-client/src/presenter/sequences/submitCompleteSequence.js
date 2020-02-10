import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearCompleteFormAction } from '../actions/clearCompleteFormAction';
import { completeWorkItemAction } from '../actions/completeWorkItemAction';
import { navigateToMessagesAction } from '../actions/navigateToMessagesAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { unsetShowForwardInputs } from '../actions/unsetShowForwardInputs';

export const submitCompleteSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  completeWorkItemAction,
  refreshCaseAction,
  clearCompleteFormAction,
  unsetShowForwardInputs,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  navigateToMessagesAction,
]);
