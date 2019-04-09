import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const dismissCreateMessageModalSequence = [
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  clearUsersAction,
  clearAlertsAction,
  clearModalAction,
  clearModalStateAction,
];
