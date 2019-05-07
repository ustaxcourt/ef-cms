import { assignSelectedWorkItemsAction } from '../actions/assignSelectedWorkItemsAction';
import { getWorkItemsForSectionAction } from '../actions/getWorkItemsForSectionAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setWorkItemsAction } from '../actions/setWorkItemsAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const assignSelectedWorkItemsSequence = [
  setFormSubmittingAction,
  assignSelectedWorkItemsAction,
  getWorkItemsForSectionAction,
  setWorkItemsAction,
  unsetFormSubmittingAction,
];
