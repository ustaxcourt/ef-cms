import { clearSelectAllWorkItemsCheckboxAction } from '../actions/clearSelectAllWorkItemsCheckboxAction';
import { clearSelectedWorkItemsAction } from '../actions/clearSelectedWorkItemsAction';

/**
 * clear state.selectedWorkItems
 */
export const clearSelectedWorkItemsSequence = [
  clearSelectedWorkItemsAction,
  clearSelectAllWorkItemsCheckboxAction,
];
