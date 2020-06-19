import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { completeCaseMessageAction } from '../actions/CaseDetail/completeCaseMessageAction';
import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { navigateToCaseMessagesAction } from '../actions/navigateToCaseMessagesAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const completeCaseMessageSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  getMostRecentMessageInThreadAction,
  completeCaseMessageAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  clearScreenMetadataAction,
  clearUsersAction,
  clearModalAction,
  clearModalStateAction,
  navigateToCaseMessagesAction,
]);
