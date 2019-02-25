import { assignSelectedWorkItemsAction } from '../actions/assignSelectedWorkItemsAction';
import { getWorkItemsForSectionAction } from '../actions/getWorkItemsForSectionAction';
import { setWorkItemsAction } from '../actions/setWorkItemsAction';

export const assignSelectedWorkItemsSequence = [
  assignSelectedWorkItemsAction,
  getWorkItemsForSectionAction,
  setWorkItemsAction,
];
