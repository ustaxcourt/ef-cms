import { clearModalAction } from '../actions/clearModalAction';
import { confirmWorkItemAlreadyCompleteAction } from '../actions/confirmWorkItemAlreadyCompleteAction';

export const confirmWorkItemAlreadyCompleteSequence = [
  confirmWorkItemAlreadyCompleteAction,
  clearModalAction,
];
